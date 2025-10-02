-- CreateTable
CREATE TABLE "public"."Streamer" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Streamer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Link" (
    "id" TEXT NOT NULL,
    "streamerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Link" ADD CONSTRAINT "Link_streamerId_fkey" FOREIGN KEY ("streamerId") REFERENCES "public"."Streamer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
