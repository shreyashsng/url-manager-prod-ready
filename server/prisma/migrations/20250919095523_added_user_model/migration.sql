/*
  Warnings:

  - A unique constraint covering the columns `[original]` on the table `Url` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Url_original_key" ON "public"."Url"("original");
