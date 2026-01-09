import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { deleteSession, getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import ProfileForm from "./profile-form";
export default async function AccountPage() {
  const session = await getSession();
  const logout = async () => {
    "use server";
    await deleteSession();
    redirect("/auth/login");
  };

  if (!session) {
    redirect("/auth/login");
  }

  const user = await prisma.users.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      name: true,
      email: true,
    },
  });

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <main>
      <ProfileForm user={user} />
      <form action={logout} className="flex justify-center mt-6">
        <Button variant={"destructive"} className="bg-red-600 hover:bg-red-700">
          Déconnexion
        </Button>
      </form>
    </main>
  );
}
