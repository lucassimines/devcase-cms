/*
  Warnings:

  - You are about to drop the column `hourlyRate` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the `TimeEntry` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TimeEntry" DROP CONSTRAINT "TimeEntry_taskId_fkey";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "hourlyRate";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "hourlyRate" DECIMAL(10,2) NOT NULL DEFAULT 0.00;

-- DropTable
DROP TABLE "TimeEntry";

-- DropEnum
DROP TYPE "PaymentType";
