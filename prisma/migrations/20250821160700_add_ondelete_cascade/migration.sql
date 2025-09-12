/*
  Warnings:

  - You are about to drop the column `bio` on the `teachers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."announcements" DROP CONSTRAINT "announcements_posted_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."assignments" DROP CONSTRAINT "assignments_teacher_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."blog_posts" DROP CONSTRAINT "blog_posts_author_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."certificates" DROP CONSTRAINT "certificates_student_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."homework" DROP CONSTRAINT "homework_teacher_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."live_classes" DROP CONSTRAINT "live_classes_course_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."live_classes" DROP CONSTRAINT "live_classes_teacher_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."messages" DROP CONSTRAINT "messages_receiver_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."messages" DROP CONSTRAINT "messages_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."student_assignments" DROP CONSTRAINT "student_assignments_assignment_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."student_assignments" DROP CONSTRAINT "student_assignments_student_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."student_courses" DROP CONSTRAINT "student_courses_course_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."student_courses" DROP CONSTRAINT "student_courses_student_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."students" DROP CONSTRAINT "students_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."teacher_courses" DROP CONSTRAINT "teacher_courses_course_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."teacher_courses" DROP CONSTRAINT "teacher_courses_teacher_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."teachers" DROP CONSTRAINT "teachers_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."teachers" DROP COLUMN "bio";

-- AddForeignKey
ALTER TABLE "public"."teachers" ADD CONSTRAINT "teachers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."teacher_courses" ADD CONSTRAINT "teacher_courses_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."teacher_courses" ADD CONSTRAINT "teacher_courses_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_courses" ADD CONSTRAINT "student_courses_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_courses" ADD CONSTRAINT "student_courses_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assignments" ADD CONSTRAINT "assignments_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_assignments" ADD CONSTRAINT "student_assignments_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_assignments" ADD CONSTRAINT "student_assignments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."homework" ADD CONSTRAINT "homework_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."live_classes" ADD CONSTRAINT "live_classes_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."live_classes" ADD CONSTRAINT "live_classes_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_posts" ADD CONSTRAINT "blog_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."announcements" ADD CONSTRAINT "announcements_posted_by_fkey" FOREIGN KEY ("posted_by") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
