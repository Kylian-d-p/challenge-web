import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import ReservationsClient from "./reservations-client";

export default async function ReservationsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  // Récupérer toutes les réservations de l'utilisateur pour les cours à venir
  const bookings = await prisma.bookings.findMany({
    where: {
      userId: session.user.id,
      course: {
        startDateTime: {
          gte: new Date(),
        },
      },
    },
    include: {
      course: {
        include: {
          activity: true,
          _count: {
            select: {
              bookings: true,
            },
          },
        },
      },
    },
    orderBy: {
      course: {
        startDateTime: "asc",
      },
    },
  });

  return (
    <div className="container mx-auto py-8">
      <ReservationsClient bookings={bookings} />
    </div>
  );
}
