/*
  Warnings:

  - You are about to drop the column `teachersId` on the `courses_modules` table. All the data in the column will be lost.
  - Added the required column `modulesId` to the `courses_modules` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "courses_modules" DROP CONSTRAINT "courses_modules_teachersId_fkey";

-- AlterTable
ALTER TABLE "courses_modules" DROP COLUMN "teachersId",
ADD COLUMN     "modulesId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "courses_modules" ADD CONSTRAINT "courses_modules_modulesId_fkey" FOREIGN KEY ("modulesId") REFERENCES "modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
