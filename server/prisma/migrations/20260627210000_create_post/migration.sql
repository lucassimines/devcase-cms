-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "title" JSONB NOT NULL,
    "subtitle" JSONB,
    "content" JSONB,
    "slug" TEXT NOT NULL,
    "image" JSONB,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
