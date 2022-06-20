-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('PICTURE', 'VIDEO');

-- CreateTable
CREATE TABLE "Post" (
    "postId" SERIAL NOT NULL,
    "description" TEXT,
    "authorId" INTEGER NOT NULL,
    "type" "PostType" NOT NULL,
    "url" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("postId")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
