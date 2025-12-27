/*
  Warnings:

  - You are about to drop the column `slug` on the `profiles` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "profiles_slug_key";

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "slug";
