-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('HOURLY', 'ONE_TIME', 'INSTALLMENT', 'RECURRING');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "paymentType" "PaymentType" NOT NULL DEFAULT 'HOURLY';
