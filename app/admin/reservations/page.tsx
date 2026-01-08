import prisma from "@/lib/prisma";
import ReservationsClient from "./reservations-client";

export default async function ReservationsPage() {
  const courses = await prisma.courses.findMany({
    where: {
      startDateTime: {
        gte: new Date(),
      },
    },
    include: {
      activity: true,
      bookings: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      startDateTime: "asc",
    },
  });

  return (
    <div className="container mx-auto py-8">
      <ReservationsClient courses={courses} />
    </div>
  );
}
