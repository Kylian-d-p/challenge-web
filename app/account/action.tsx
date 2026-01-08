"use server";

import prisma from "@/lib/prisma";
import { createSafeAction } from "@/lib/safe-actions";
import { getSession } from "@/lib/session";
import { formSchemas } from "@/lib/types";
import { redirect } from "next/navigation";

export const updateProfileAction = createSafeAction.inputSchema(formSchemas.updateProfile).action(async ({ parsedInput }) => {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  // Vérifier si l'email existe déjà pour un autre utilisateur
  const existingUser = await prisma.users.findFirst({
    where: {
      email: parsedInput.email,
      NOT: {
        id: session.user.id,
      },
    },
  });

  if (existingUser) {
    throw new Error("Cet email est déjà utilisé par un autre compte");
  }

  await prisma.users.update({
    where: {
      id: session.user.id,
    },
    data: {
      name: parsedInput.name,
      email: parsedInput.email,
    },
  });

  return { message: "Profil mis à jour avec succès", success: true };
});
