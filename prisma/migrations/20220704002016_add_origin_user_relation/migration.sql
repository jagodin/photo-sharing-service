/*
  Warnings:

  - Added the required column `originUserId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "originUserId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_originUserId_fkey" FOREIGN KEY ("originUserId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
