"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import relativeTime from "dayjs/plugin/relativeTime";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

dayjs.locale("fr");
dayjs.extend(relativeTime);

type Course = {
  id: string;
  activityId: string;
  startDateTime: Date;
  capacity: number;
  activity: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    duration: number;
  };
  bookings: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }[];
};

export default function ReservationsClient({ courses }: { courses: Course[] }) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setDialogOpen(true);
  };

  // Grouper les cours par date
  const groupedCourses = courses.reduce((acc, course) => {
    const date = dayjs(course.startDateTime).format("YYYY-MM-DD");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  const sortedDates = Object.keys(groupedCourses).sort();

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4">
      {/* En-tête */}
      <div className="border-b pb-4">
        <h1 className="font-bold text-3xl md:text-4xl bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">Réservations</h1>
        <p className="text-muted-foreground text-sm mt-1">Gérez et visualisez tous les cours à venir et leurs participants</p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total des cours</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-1">{courses.length}</p>
            </div>
            <Calendar className="w-10 h-10 text-blue-600 dark:text-blue-400 opacity-70" />
          </div>
        </div>

        <div className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300">Réservations</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-1">
                {courses.reduce((acc, course) => acc + course.bookings.length, 0)}
              </p>
            </div>
            <Users className="w-10 h-10 text-green-600 dark:text-green-400 opacity-70" />
          </div>
        </div>

        <div className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Taux de remplissage</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                {courses.length > 0
                  ? Math.round(
                      (courses.reduce((acc, course) => acc + course.bookings.length, 0) / courses.reduce((acc, course) => acc + course.capacity, 0)) *
                        100
                    )
                  : 0}
                %
              </p>
            </div>
            <MapPin className="w-10 h-10 text-purple-600 dark:text-purple-400 opacity-70" />
          </div>
        </div>
      </div>

      {/* Liste des cours */}
      {sortedDates.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/20">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <span className="text-muted-foreground text-center max-w-md">
            Aucun cours à venir pour le moment. Les cours seront générés automatiquement.
          </span>
        </div>
      ) : (
        sortedDates.map((date) => (
          <div key={date} className="space-y-4">
            {/* En-tête de date */}
            <div className="flex items-center gap-3 sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-2">
              <div className="h-px flex-1 bg-border" />
              <h2 className="font-semibold text-lg capitalize px-4 py-2 bg-primary/10 rounded-lg">{dayjs(date).format("dddd D MMMM YYYY")}</h2>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Cours du jour */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {groupedCourses[date].map((course) => {
                const bookingCount = course.bookings.length;
                const fillPercentage = (bookingCount / course.capacity) * 100;
                const isFull = bookingCount >= course.capacity;

                return (
                  <div
                    key={course.id}
                    onClick={() => handleCourseClick(course)}
                    className="group relative cursor-pointer bg-card border-2 rounded-xl overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 hover:scale-[1.02]"
                  >
                    {/* Image de fond */}
                    <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Image src={course.activity.imageUrl} alt={course.activity.name} width={200} height={200} />
                    </div>

                    {/* Contenu */}
                    <div className="relative p-6 space-y-4">
                      {/* En-tête */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-xl mb-1 group-hover:text-primary transition-colors">{course.activity.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{course.activity.description}</p>
                        </div>

                        {/* Badge statut */}
                        {isFull ? (
                          <span className="px-3 py-1 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-xs font-semibold rounded-full">
                            Complet
                          </span>
                        ) : bookingCount === 0 ? (
                          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full">
                            Vide
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full">
                            Places disponibles
                          </span>
                        )}
                      </div>

                      {/* Informations */}
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{dayjs(course.startDateTime).format("HH:mm")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{course.activity.duration} minutes</span>
                        </div>
                      </div>

                      {/* Barre de progression */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">Participants</span>
                          <span className="text-muted-foreground">
                            {bookingCount} / {course.capacity}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${isFull ? "bg-red-500" : fillPercentage > 75 ? "bg-orange-500" : "bg-green-500"}`}
                            style={{ width: `${fillPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Call to action */}
                      <div className="pt-2 border-t">
                        <p className="text-sm text-primary group-hover:underline font-medium">Cliquez pour voir les participants →</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Dialog pour afficher les participants */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedCourse?.activity.name}</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{dayjs(selectedCourse?.startDateTime).format("dddd D MMMM YYYY")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>
                    {dayjs(selectedCourse?.startDateTime).format("HH:mm")} -{" "}
                    {dayjs(selectedCourse?.startDateTime)
                      .add(selectedCourse?.activity.duration || 0, "minute")
                      .format("HH:mm")}
                  </span>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-semibold">{selectedCourse?.bookings.length || 0} participant(s)</span>
              </div>
              <span className="text-sm text-muted-foreground">Capacité: {selectedCourse?.capacity}</span>
            </div>

            {/* Liste des participants */}
            {selectedCourse?.bookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Aucun participant pour le moment</div>
            ) : (
              <div className="space-y-2">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Liste des participants</h3>
                <div className="space-y-2">
                  {selectedCourse?.bookings.map((booking, index) => (
                    <div key={booking.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      {/* Avatar avec initiales */}
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                        {booking.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>

                      {/* Informations utilisateur */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{booking.user.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{booking.user.email}</p>
                      </div>

                      {/* Numéro */}
                      <div className="text-sm text-muted-foreground font-mono">#{index + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
