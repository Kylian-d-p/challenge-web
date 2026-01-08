import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import PlanningClient from "./planning-client";

export default async function PlanningPage() {
  const session = await getSession();

  // Récupérer tous les cours à venir
  const courses = await prisma.courses.findMany({
    where: {
      startDateTime: {
        gte: new Date(),
      },
    },
    include: {
      activity: true,
      bookings: {
        select: {
          id: true,
          userId: true,
        },
      },
      ...(session && {
        bookings: {
          where: {
            userId: session.user.id,
          },
          take: 1,
        },
      }),
    },
    orderBy: {
      startDateTime: "asc",
    },
  });

  // Transformer les données pour le client
  const coursesWithUserBooking = courses.map((course) => ({
    ...course,
    userBooking: session && "bookings" in course ? course.bookings[0] || null : null,
  }));

  return (
    <div className="container mx-auto py-8">
      <PlanningClient courses={coursesWithUserBooking} isAuthenticated={!!session} />
    </div>
  );
}
