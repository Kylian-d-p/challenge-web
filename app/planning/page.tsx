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
    },
    orderBy: {
      startDateTime: "asc",
    },
  });

  return (
    <div className="container mx-auto py-8">
      <PlanningClient courses={courses} isAuthenticated={!!session} />
    </div>
  );
}
