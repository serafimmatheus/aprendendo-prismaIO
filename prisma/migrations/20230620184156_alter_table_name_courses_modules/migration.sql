/*
  Warnings:

  - You are about to drop the `CoursesModules` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CoursesModules" DROP CONSTRAINT "CoursesModules_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CoursesModules" DROP CONSTRAINT "CoursesModules_teachersId_fkey";

-- DropTable
DROP TABLE "CoursesModules";

-- CreateTable
CREATE TABLE "courses_modules" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "teachersId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "courses_modules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "courses_modules" ADD CONSTRAINT "courses_modules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses_modules" ADD CONSTRAINT "courses_modules_teachersId_fkey" FOREIGN KEY ("teachersId") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
