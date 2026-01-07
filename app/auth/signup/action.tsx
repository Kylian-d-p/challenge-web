"use server";

import prisma from "@/lib/prisma";
import { createSafeAction } from "@/lib/safe-actions";
import { createSession } from "@/lib/session";
import { formSchemas } from "@/lib/types";
import argon2 from "argon2";
import { redirect } from "next/navigation";

export const signupAction = createSafeAction.inputSchema(formSchemas.signup).action(async ({ parsedInput }) => {
  const user = await prisma.users.findUnique({ where: { email: parsedInput.email } });
  if (user) {
    return { message: "Un utilisateur avec cet email existe déjà", success: false };
  }

  const hashedPassword = await argon2.hash(parsedInput.password);

  const newUser = await prisma.users.create({
    data: {
      email: parsedInput.email,
      password: hashedPassword,
      name: parsedInput.name,
    },
  });

  await createSession(newUser.id);

  redirect("/");
});
