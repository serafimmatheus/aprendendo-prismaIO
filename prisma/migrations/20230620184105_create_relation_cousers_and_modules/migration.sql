-- CreateTable
CREATE TABLE "CoursesModules" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "teachersId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoursesModules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CoursesModules" ADD CONSTRAINT "CoursesModules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursesModules" ADD CONSTRAINT "CoursesModules_teachersId_fkey" FOREIGN KEY ("teachersId") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
