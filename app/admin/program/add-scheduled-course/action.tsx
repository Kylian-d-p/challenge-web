"use server";

import prisma from "@/lib/prisma";
import { createSafeAction } from "@/lib/safe-actions";
import { isAdmin } from "@/lib/server-actions-middleware";
import { formSchemas } from "@/lib/types";
import { revalidatePath } from "next/cache";

export const addScheduledCourseAction = createSafeAction
  .use(isAdmin)
  .inputSchema(formSchemas.addScheduledCourse)
  .action(async ({ parsedInput }) => {
    console.log(parsedInput)
    await prisma.scheduledCourses.create({
      data: {
        activityId: parsedInput.activityId,
        dayOfWeek: Number(parsedInput.dayOfWeek),
        startTime: Number(parsedInput.startTime),
        capacity: Number(parsedInput.capacity),
      },
    });

    revalidatePath("/");

    return { message: "Session programmée avec succès", success: true };
  });
