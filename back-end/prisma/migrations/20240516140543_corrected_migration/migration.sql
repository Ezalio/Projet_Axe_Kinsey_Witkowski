/*
  Warnings:

  - You are about to drop the column `createdAt` on the `usercard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `usercard` DROP COLUMN `createdAt`,
    MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
