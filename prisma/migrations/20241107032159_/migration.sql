/*
  Warnings:

  - Added the required column `appointmentDate` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'RESCHEDULED';

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "appointmentDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "reason" TEXT,
ALTER COLUMN "status" DROP DEFAULT;
