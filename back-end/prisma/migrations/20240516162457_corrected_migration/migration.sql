-- DropIndex
DROP INDEX `UserCard_userId_cardId_key` ON `usercard`;

-- AlterTable
ALTER TABLE `usercard` ADD COLUMN `favorite` BOOLEAN NOT NULL DEFAULT false,
    ALTER COLUMN `quantity` DROP DEFAULT;
