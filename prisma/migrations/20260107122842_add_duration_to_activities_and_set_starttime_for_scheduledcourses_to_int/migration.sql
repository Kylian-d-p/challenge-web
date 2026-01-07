/*
  Warnings:

  - Added the required column `duration` to the `activities` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `start_time` on the `scheduled_courses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "activities" ADD COLUMN     "duration" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "scheduled_courses" DROP COLUMN "start_time",
ADD COLUMN     "start_time" INTEGER NOT NULL;
