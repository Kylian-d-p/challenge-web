"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import relativeTime from "dayjs/plugin/relativeTime";
import { Calendar, Check, Clock, MapPin, Users, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { bookCourseAction, cancelBookingAction } from "./action";

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
    userId: string;
  }[];
  userBooking?: {
    id: string;
  } | null;
};

type PlanningClientProps = {
  courses: Course[];
  isAuthenticated: boolean;
};

export default function PlanningClient({ courses, isAuthenticated }: PlanningClientProps) {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setDialogOpen(true);
  };

  const handleBookCourse = async () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (!selectedCourse) return;

    setIsBooking(true);

    const result = await bookCourseAction({ courseId: selectedCourse.id });

    if (result?.serverError) {
      toast.error(result.serverError.message);
    } else if (result?.data?.success) {
      toast.success(result.data.message);
      setDialogOpen(false);
      router.refresh();
    }

    setIsBooking(false);
  };

  const handleCancelBooking = async () => {
    if (!selectedCourse) return;

    setIsBooking(true);

    const result = await cancelBookingAction({ courseId: selectedCourse.id });

    if (result?.serverError) {
      toast.error(result.serverError.message);
    } else if (result?.data?.success) {
      toast.success(result.data.message);
      setDialogOpen(false);
      router.refresh();
    }

    setIsBooking(false);
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

  const isUserBooked = selectedCourse?.userBooking !== null && selectedCourse?.userBooking !== undefined;
  const isFull = (selectedCourse?.bookings.length || 0) >= (selectedCourse?.capacity || 0);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4">
      {/* En-tête */}
      <div className="border-b pb-4">
        <h1 className="font-bold text-3xl md:text-4xl bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">Planning</h1>
        <p className="text-muted-foreground text-sm mt-1">Découvrez tous les cours à venir et inscrivez-vous !</p>
      </div>

      {/* Liste des cours */}
      {sortedDates.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/20">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <span className="text-muted-foreground text-center max-w-md">
            Aucun cours à venir pour le moment. Revenez bientôt pour découvrir nos prochaines sessions !
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
                const isCourseFull = bookingCount >= course.capacity;
                const isBooked = course.userBooking !== null && course.userBooking !== undefined;

                return (
                  <div
                    key={course.id}
                    onClick={() => handleCourseClick(course)}
                    className="group relative cursor-pointer bg-card border-2 rounded-xl overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 hover:scale-[1.02]"
                  >
                    {/* Image de fond */}
                    <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Image src={course.activity.imageUrl} alt={course.activity.name} fill className="object-cover" />
                    </div>

                    {/* Badge inscription */}
                    {isBooked && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg">
                          <Check className="w-3 h-3" />
                          Inscrit
                        </span>
                      </div>
                    )}

                    {/* Contenu */}
                    <div className="relative p-6 space-y-4">
                      {/* En-tête */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-xl mb-1 group-hover:text-primary transition-colors">{course.activity.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{course.activity.description}</p>
                        </div>

                        {/* Badge statut */}
                        {isCourseFull ? (
                          <span className="px-3 py-1 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-xs font-semibold rounded-full">
                            Complet
                          </span>
                        ) : bookingCount === 0 ? (
                          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full">
                            Disponible
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
                            className={`h-full transition-all ${
                              isCourseFull ? "bg-red-500" : fillPercentage > 75 ? "bg-orange-500" : "bg-green-500"
                            }`}
                            style={{ width: `${fillPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Call to action */}
                      <div className="pt-2 border-t">
                        <p className="text-sm text-primary group-hover:underline font-medium">
                          {isBooked ? "Gérer mon inscription →" : "Cliquez pour vous inscrire →"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Dialog pour afficher les détails et s'inscrire */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedCourse?.activity.name}</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2">
                <p className="text-sm">{selectedCourse?.activity.description}</p>
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
            {/* Image du cours */}
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image src={selectedCourse?.activity.imageUrl || ""} alt={selectedCourse?.activity.name || ""} fill className="object-cover" />
            </div>

            {/* Statut et places */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-semibold">{selectedCourse?.bookings.length || 0} participant(s)</span>
              </div>
              <span className="text-sm text-muted-foreground">Capacité: {selectedCourse?.capacity}</span>
            </div>

            {/* Actions */}
            {!isAuthenticated ? (
              <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">Connectez-vous pour réserver ce cours</p>
                <Button onClick={() => router.push("/auth/login")} className="w-full">
                  Se connecter
                </Button>
              </div>
            ) : isUserBooked ? (
              <div className="space-y-3">
                <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <Check className="w-5 h-5" />
                    <span className="font-semibold">Vous êtes inscrit à ce cours</span>
                  </div>
                </div>
                <Button onClick={handleCancelBooking} disabled={isBooking} variant="destructive" className="w-full">
                  <X className="w-4 h-4 mr-2" />
                  {isBooking ? "Annulation..." : "Annuler mon inscription"}
                </Button>
              </div>
            ) : isFull ? (
              <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300 font-semibold">Ce cours est complet</p>
              </div>
            ) : (
              <Button onClick={handleBookCourse} disabled={isBooking} className="w-full">
                <Check className="w-4 h-4 mr-2" />
                {isBooking ? "Inscription..." : "S'inscrire au cours"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
