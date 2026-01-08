"use server";

import prisma from "@/lib/prisma";
import { createSafeAction } from "@/lib/safe-actions";
import { isAdmin } from "@/lib/server-actions-middleware";
import { formSchemas } from "@/lib/types";
import { revalidatePath } from "next/cache";

export const deleteActivityAction = createSafeAction
  .use(isAdmin)
  .inputSchema(formSchemas.deleteActivity)
  .action(async ({ parsedInput }) => {
    await prisma.activities.delete({
      where: { id: parsedInput.id },
    });

    revalidatePath("/");

    return { message: "Activité supprimée avec succès", success: true };
  });
