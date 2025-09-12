/*
  Warnings:

  - Added the required column `teacher_id` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- ALTER TABLE "public"."courses" ADD COLUMN     "teacher_id" TEXT NOT NULL;

-- AddForeignKey
-- ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
