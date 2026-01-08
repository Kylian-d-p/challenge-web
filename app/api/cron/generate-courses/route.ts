import { env } from "@/lib/env";
import prisma from "@/lib/prisma";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";
import { NextRequest, NextResponse } from "next/server";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekday);

export const dynamic = "force-dynamic";

/**
 * Cronjob qui génère les cours pour les 12 prochaines semaines
 * S'exécute tous les lundis à 8h
 * Route: /api/cron/generate-courses
 */
export async function GET(request: NextRequest) {
  try {
    // Vérification de sécurité : token d'autorisation
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Récupérer tous les cours planifiés
    const scheduledCourses = await prisma.scheduledCourses.findMany({
      include: {
        activity: true,
      },
    });

    if (scheduledCourses.length === 0) {
      return NextResponse.json({
        message: "Aucun cours planifié trouvé",
        created: 0,
      });
    }

    // Date de référence : lundi prochain à 00:00:00
    const nextMonday = dayjs().add(1, "week").weekday(1).startOf("day");

    const coursesToCreate = [];
    let skippedCourses = 0;

    // Pour chaque semaine des 12 prochaines semaines
    for (let weekOffset = 0; weekOffset < 12; weekOffset++) {
      const weekStart = nextMonday.add(weekOffset, "week");

      // Créer tous les cours planifiés pour cette semaine
      for (const scheduled of scheduledCourses) {
        // dayOfWeek dans la DB: 1=Lundi, 2=Mardi, ..., 7=Dimanche
        // dayjs weekday: 0=Dimanche, 1=Lundi, ..., 6=Samedi
        let dayjsWeekday = scheduled.dayOfWeek;
        if (dayjsWeekday === 7) {
          dayjsWeekday = 0; // Dimanche
        }

        const courseDate = weekStart.weekday(dayjsWeekday);

        const totalSeconds = scheduled.startTime;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const startDateTime = courseDate.hour(hours).minute(minutes).second(0).millisecond(0).toDate();

        // Vérifier si un cours existe déjà pour cette activité à cette date/heure
        const existingCourse = await prisma.courses.findFirst({
          where: {
            activityId: scheduled.activityId,
            startDateTime: startDateTime,
          },
        });

        // Si le cours existe déjà, on le skip
        if (existingCourse) {
          skippedCourses++;
          continue;
        }

        coursesToCreate.push({
          activityId: scheduled.activityId,
          startDateTime: startDateTime,
          capacity: scheduled.capacity,
        });
      }
    }

    // Créer tous les cours en une seule transaction
    let createdCount = 0;
    if (coursesToCreate.length > 0) {
      const result = await prisma.courses.createMany({
        data: coursesToCreate,
        skipDuplicates: true,
      });
      createdCount = result.count;
    }

    return NextResponse.json({
      message: "Génération des cours terminée",
      created: createdCount,
      scheduled: scheduledCourses.length,
      weeksGenerated: 12,
      coursesSkipped: skippedCourses,
      nextMondayStart: nextMonday.format("YYYY-MM-DD"),
    });
  } catch (error) {
    console.error("❌ Erreur lors de la génération des cours:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la génération des cours",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
