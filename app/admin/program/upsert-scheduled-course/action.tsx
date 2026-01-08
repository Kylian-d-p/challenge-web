"use server";

import prisma from "@/lib/prisma";
import { createSafeAction } from "@/lib/safe-actions";
import { isAdmin } from "@/lib/server-actions-middleware";
import { formSchemas } from "@/lib/types";
import { revalidatePath } from "next/cache";

export const upsertScheduledCourseAction = createSafeAction
  .use(isAdmin)
  .inputSchema(formSchemas.upsertScheduledCourse)
  .action(async ({ parsedInput }) => {
    await prisma.scheduledCourses.upsert({
      where: {
        id: parsedInput.id || "",
      },
      update: {
        activityId: parsedInput.activityId,
        dayOfWeek: Number(parsedInput.dayOfWeek),
        startTime: Number(parsedInput.startTime),
        capacity: Number(parsedInput.capacity),
      },
      create: {
        activityId: parsedInput.activityId,
        dayOfWeek: Number(parsedInput.dayOfWeek),
        startTime: Number(parsedInput.startTime),
        capacity: Number(parsedInput.capacity),
      },
    });

    revalidatePath("/");

    return { message: "Session programmée avec succès", success: true };
  });
