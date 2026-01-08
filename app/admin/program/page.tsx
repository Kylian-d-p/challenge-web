import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Program from "./program";

export default async function ProgramPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const activities = await prisma.activities.findMany({
    select: {
      id: true,
      name: true,
      duration: true,
    },
  });

  const scheduledCourses = await prisma.scheduledCourses.findMany();

  return (
    <main className="max-w-3xl w-full mx-auto p-2 mt-4">
      <Program activities={activities} scheduledCourses={scheduledCourses} />
    </main>
  );
}
