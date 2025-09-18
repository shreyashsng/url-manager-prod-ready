-- CreateTable
CREATE TABLE "public"."ClickEvent" (
    "id" SERIAL NOT NULL,
    "urlId" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "referer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClickEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ClickEvent" ADD CONSTRAINT "ClickEvent_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "public"."Url"("id") ON DELETE CASCADE ON UPDATE CASCADE;
