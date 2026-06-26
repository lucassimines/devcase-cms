/*
  Warnings:

  - Changed the type of `name` on the `Solution` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Solution"
  ALTER COLUMN "name" SET DATA TYPE JSONB
  USING jsonb_build_object('en-US', "name");
