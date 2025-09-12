/*
  Warnings:

  - You are about to drop the column `grade_level` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."teachers" ADD COLUMN     "bio" TEXT;

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "grade_level";
