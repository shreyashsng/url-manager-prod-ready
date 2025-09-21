/*
  Warnings:

  - Made the column `userId` on table `Url` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Url" ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Url_userId_idx" ON "public"."Url"("userId");
