/*
  Warnings:

  - You are about to drop the column `key` on the `settings` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `settings` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."settings_key_key";

-- AlterTable
ALTER TABLE "public"."settings" DROP COLUMN "key",
DROP COLUMN "value",
ADD COLUMN     "auto_backup" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "maintenance_mode" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "primary_color" TEXT,
ADD COLUMN     "theme" TEXT NOT NULL DEFAULT 'light',
ALTER COLUMN "updated_at" DROP DEFAULT;
