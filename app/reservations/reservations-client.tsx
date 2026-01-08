"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import relativeTime from "dayjs/plugin/relativeTime";
import { Calendar, Clock, MapPin, Trash2, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { cancelBookingAction } from "../planning/action";

dayjs.locale("fr");
dayjs.extend(relativeTime);

type Booking = {
  id: string;
  courseId: string;
  createdAt: Date;
  course: {
    id: string;
    startDateTime: Date;
    capacity: number;
    activity: {
      id: string;
      name: string;
      description: string;
      imageUrl: string;
      duration: number;
    };
    _count: {
      bookings: number;
    };
  };
};

export default function ReservationsClient({ bookings }: { bookings: Booking[] }) {
  const router = useRouter();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    setIsCancelling(true);

    const result = await cancelBookingAction({ courseId: selectedBooking.courseId });

    if (result?.serverError) {
      toast.error(result.serverError.message);
    } else if (result?.data?.success) {
      toast.success(result.data.message);
      setDialogOpen(false);
      router.refresh();
    }

    setIsCancelling(false);
  };

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  // Grouper les réservations par date
  const groupedBookings = bookings.reduce((acc, booking) => {
    const date = dayjs(booking.course.startDateTime).format("YYYY-MM-DD");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(booking);
    return acc;
  }, {} as Record<string, Booking[]>);

  const sortedDates = Object.keys(groupedBookings).sort();

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4">
      {/* En-tête */}
      <div className="border-b pb-4">
        <h1 className="font-bold text-3xl md:text-4xl bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">Mes réservations</h1>
        <p className="text-muted-foreground text-sm mt-1">Gérez vos inscriptions aux cours à venir</p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Réservations actives</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-1">{bookings.length}</p>
            </div>
            <Calendar className="w-10 h-10 text-blue-600 dark:text-blue-400 opacity-70" />
          </div>
        </div>

        <div className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300">Prochain cours</p>
              <p className="text-xl font-bold text-green-900 dark:text-green-100 mt-1">
                {bookings.length > 0 ? dayjs(bookings[0].course.startDateTime).format("DD/MM") : "-"}
              </p>
            </div>
            <Clock className="w-10 h-10 text-green-600 dark:text-green-400 opacity-70" />
          </div>
        </div>

        <div className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Activités différentes</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                {new Set(bookings.map((b) => b.course.activity.id)).size}
              </p>
            </div>
            <Users className="w-10 h-10 text-purple-600 dark:text-purple-400 opacity-70" />
          </div>
        </div>
      </div>

      {/* Liste des réservations */}
      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/20">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <span className="text-muted-foreground text-center max-w-md mb-4">Vous n&apos;avez aucune réservation pour le moment</span>
          <Button onClick={() => router.push("/planning")}>Découvrir les cours</Button>
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
              {groupedBookings[date].map((booking) => {
                const bookingCount = booking.course._count.bookings;
                const fillPercentage = (bookingCount / booking.course.capacity) * 100;

                return (
                  <div
                    key={booking.id}
                    onClick={() => handleBookingClick(booking)}
                    className="group relative cursor-pointer bg-card border-2 border-green-200 dark:border-green-800 rounded-xl overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 hover:scale-[1.02]"
                  >
                    {/* Badge réservé */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg">
                        ✓ Réservé
                      </span>
                    </div>

                    {/* Image de fond */}
                    <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Image src={booking.course.activity.imageUrl} alt={booking.course.activity.name} fill className="object-cover" />
                    </div>

                    {/* Contenu */}
                    <div className="relative p-6 space-y-4">
                      {/* En-tête */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-xl mb-1 group-hover:text-primary transition-colors">{booking.course.activity.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{booking.course.activity.description}</p>
                        </div>
                      </div>

                      {/* Informations */}
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{dayjs(booking.course.startDateTime).format("HH:mm")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{booking.course.activity.duration} minutes</span>
                        </div>
                      </div>

                      {/* Barre de progression */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">Participants</span>
                          <span className="text-muted-foreground">
                            {bookingCount} / {booking.course.capacity}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              fillPercentage > 90 ? "bg-red-500" : fillPercentage > 75 ? "bg-orange-500" : "bg-green-500"
                            }`}
                            style={{ width: `${fillPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Info réservation */}
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">Réservé le {dayjs(booking.createdAt).format("DD/MM/YYYY à HH:mm")}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Dialog pour confirmer l'annulation */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedBooking?.course.activity.name}</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2">
                <p className="text-sm">{selectedBooking?.course.activity.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{dayjs(selectedBooking?.course.startDateTime).format("dddd D MMMM YYYY")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>
                    {dayjs(selectedBooking?.course.startDateTime).format("HH:mm")} -{" "}
                    {dayjs(selectedBooking?.course.startDateTime)
                      .add(selectedBooking?.course.activity.duration || 0, "minute")
                      .format("HH:mm")}
                  </span>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Image du cours */}
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={selectedBooking?.course.activity.imageUrl || ""}
                alt={selectedBooking?.course.activity.name || ""}
                fill
                className="object-cover"
              />
            </div>

            {/* Statut réservation */}
            <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <Calendar className="w-5 h-5" />
                <div>
                  <p className="font-semibold">Réservation confirmée</p>
                  <p className="text-sm">Réservé le {dayjs(selectedBooking?.createdAt).format("DD/MM/YYYY à HH:mm")}</p>
                </div>
              </div>
            </div>

            {/* Participants */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-semibold">{selectedBooking?.course._count.bookings || 0} participant(s)</span>
              </div>
              <span className="text-sm text-muted-foreground">Capacité: {selectedBooking?.course.capacity}</span>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isCancelling}>
              Fermer
            </Button>
            <Button variant="destructive" onClick={handleCancelBooking} disabled={isCancelling}>
              <Trash2 className="w-4 h-4 mr-2" />
              {isCancelling ? "Annulation..." : "Annuler ma réservation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
