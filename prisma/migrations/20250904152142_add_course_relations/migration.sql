-- AlterTable
ALTER TABLE "public"."assignments" ADD COLUMN     "course_id" TEXT;

-- AlterTable
ALTER TABLE "public"."certificates" ADD COLUMN     "course_id" TEXT;

-- AddForeignKey
ALTER TABLE "public"."assignments" ADD CONSTRAINT "assignments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
