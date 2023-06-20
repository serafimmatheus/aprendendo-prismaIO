/*
  Warnings:

  - A unique constraint covering the columns `[teachersId]` on the table `courses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teachersId` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "teachersId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "courses_teachersId_key" ON "courses"("teachersId");

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_teachersId_fkey" FOREIGN KEY ("teachersId") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
