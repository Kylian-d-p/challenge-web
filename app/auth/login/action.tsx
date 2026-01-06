"use server";

import prisma from "@/lib/prisma";
import { createSafeAction } from "@/lib/safe-actions";
import { createSession } from "@/lib/session";
import { formSchemas } from "@/lib/types";
import argon2 from "argon2";
import { redirect } from "next/navigation";

export const loginAction = createSafeAction
  .inputSchema(formSchemas.login)
  .action(async ({ parsedInput }) => {
    const user = await prisma.users.findUnique({ where: { email: parsedInput.email } });
    if (!user) {
      throw new Error("L'email ou le mot de passe est invalide");
    }

    const ok = await argon2.verify(user.password, parsedInput.password);

    if (!ok) {
      throw new Error("L'email ou le mot de passe est invalide");
    }

    await createSession(user.id);

    redirect("/");
  });
