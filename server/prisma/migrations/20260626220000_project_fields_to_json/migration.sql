/*
  Warnings:

  - Changed the type of `name`, `url`, `description`, `background`, and `image` on the `Project` table.

*/
-- AlterTable
ALTER TABLE "Project"
  ALTER COLUMN "name" SET DATA TYPE JSONB
  USING jsonb_build_object('en-US', "name");

ALTER TABLE "Project"
  ALTER COLUMN "url" SET DATA TYPE JSONB
  USING CASE
    WHEN "url" IS NULL THEN NULL
    ELSE jsonb_build_object('en-US', "url")
  END;

ALTER TABLE "Project"
  ALTER COLUMN "description" SET DATA TYPE JSONB
  USING CASE
    WHEN "description" IS NULL THEN NULL
    ELSE jsonb_build_object('en-US', "description")
  END;

ALTER TABLE "Project"
  ALTER COLUMN "background" SET DATA TYPE JSONB
  USING CASE
    WHEN "background" IS NULL THEN NULL
    ELSE jsonb_build_object('en-US', "background")
  END;

ALTER TABLE "Project"
  ALTER COLUMN "image" SET DATA TYPE JSONB
  USING CASE
    WHEN "image" IS NULL THEN NULL
    ELSE jsonb_build_object('en-US', "image")
  END;
