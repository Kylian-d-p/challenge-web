import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import UsersClient from "./users-client";

export default async function UsersPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  // Récupérer les 20 premiers utilisateurs
  const users = await prisma.users.findMany({
    take: 20,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          bookings: true,
        },
      },
    },
  });

  return (
    <div className="container mx-auto py-8">
      <UsersClient initialUsers={users} />
    </div>
  );
}
