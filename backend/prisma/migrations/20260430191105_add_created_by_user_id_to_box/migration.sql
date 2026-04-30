/*
  Warnings:

  - Added the required column `createdByUserId` to the `Box` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Box` DROP FOREIGN KEY `Box_coupleId_fkey`;

-- DropIndex
DROP INDEX `Box_coupleId_fkey` ON `Box`;

-- AlterTable
ALTER TABLE `Box` ADD COLUMN `createdByUserId` VARCHAR(191) NOT NULL,
    MODIFY `coupleId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Box` ADD CONSTRAINT `Box_coupleId_fkey` FOREIGN KEY (`coupleId`) REFERENCES `Couple`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Box` ADD CONSTRAINT `Box_createdByUserId_fkey` FOREIGN KEY (`createdByUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
