import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { deleteSession, getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import ProfileForm from "./profile-form";
import Link from "next/link";
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
      {
        session.user.role === "ADMIN" && (
          <Link href="/admin/program" className="flex justify-center mb-4 w-full max-w-2xl mx-auto px-6">
            <Button variant={"secondary"} className="w-full">
              Accéder au panneau d&apos;administration
            </Button>
          </Link>
        )
      }
      <form action={logout} className="flex justify-center mb-4 w-full max-w-2xl mx-auto px-6">
        <Button variant={"outline"} className="w-full hover:bg-destructive hover:text-white">
          Déconnexion
        </Button>
      </form>
    </main>
  );
}
