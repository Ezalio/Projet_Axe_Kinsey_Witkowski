/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `usercard` table. All the data in the column will be lost.
  - You are about to alter the column `cardId` on the `usercard` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - A unique constraint covering the columns `[userId,cardId]` on the table `UserCard` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `User_username_key` ON `user`;

-- AlterTable
ALTER TABLE `usercard` DROP COLUMN `updatedAt`,
    MODIFY `cardId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `UserCard_userId_cardId_key` ON `UserCard`(`userId`, `cardId`);
