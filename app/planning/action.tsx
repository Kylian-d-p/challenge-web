"use server";

import prisma from "@/lib/prisma";
import { createSafeAction } from "@/lib/safe-actions";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const bookCourseSchema = z.object({
  courseId: z.string(),
});

export const bookCourseAction = createSafeAction.inputSchema(bookCourseSchema).action(async ({ parsedInput }) => {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  // Vérifier que le cours existe et n'est pas complet
  const course = await prisma.courses.findUnique({
    where: {
      id: parsedInput.courseId,
    },
    include: {
      bookings: true,
    },
  });

  if (!course) {
    throw new Error("Ce cours n'existe pas");
  }

  if (course.bookings.length >= course.capacity) {
    throw new Error("Ce cours est complet");
  }

  // Vérifier que l'utilisateur n'est pas déjà inscrit
  const existingBooking = await prisma.bookings.findFirst({
    where: {
      userId: session.user.id,
      courseId: parsedInput.courseId,
    },
  });

  if (existingBooking) {
    throw new Error("Vous êtes déjà inscrit à ce cours");
  }

  // Créer la réservation
  await prisma.bookings.create({
    data: {
      userId: session.user.id,
      courseId: parsedInput.courseId,
    },
  });

  revalidatePath("/planning");

  return { message: "Inscription réussie !", success: true };
});

export const cancelBookingAction = createSafeAction.inputSchema(bookCourseSchema).action(async ({ parsedInput }) => {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  // Supprimer la réservation
  await prisma.bookings.deleteMany({
    where: {
      userId: session.user.id,
      courseId: parsedInput.courseId,
    },
  });

  revalidatePath("/planning");
  revalidatePath("/reservations");

  return { message: "Réservation annulée", success: true };
});
