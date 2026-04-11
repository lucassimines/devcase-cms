/*
  Warnings:

  - You are about to drop the column `recurring` on the `Payment` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('HOURLY', 'ONE_TIME', 'INSTALLMENT', 'RECURRING');

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "recurring",
ADD COLUMN     "type" "PaymentType" NOT NULL DEFAULT 'ONE_TIME';
