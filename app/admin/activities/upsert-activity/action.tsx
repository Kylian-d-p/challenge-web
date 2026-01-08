"use server";

import prisma from "@/lib/prisma";
import { createSafeAction } from "@/lib/safe-actions";
import { isAdmin } from "@/lib/server-actions-middleware";
import { formSchemas } from "@/lib/types";
import { revalidatePath } from "next/cache";

export const upsertActivityAction = createSafeAction
  .use(isAdmin)
  .inputSchema(formSchemas.upsertActivity)
  .action(async ({ parsedInput }) => {
    await prisma.activities.upsert({
      where: { id: parsedInput.id || "" },
      update: {
        name: parsedInput.name,
        duration: Number(parsedInput.duration),
        description: parsedInput.description,
        imageUrl: parsedInput.imageUrl,
      },
      create: {
        name: parsedInput.name,
        duration: Number(parsedInput.duration),
        description: parsedInput.description,
        imageUrl: parsedInput.imageUrl,
      },
    });

    revalidatePath("/");

    return { message: "Activité ajoutée avec succès", success: true };
  });
