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

  return (
    <main className="max-w-4xl w-full mx-auto p-2 mt-4">
      <div className="flex flex-col gap-2">
        <Program activities={activities} />
      </div>
    </main>
  );
}
