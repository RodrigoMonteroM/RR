/*
  Warnings:

  - You are about to drop the `CoupleUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `CoupleUser` DROP FOREIGN KEY `CoupleUser_coupleId_fkey`;

-- DropForeignKey
ALTER TABLE `CoupleUser` DROP FOREIGN KEY `CoupleUser_userId_fkey`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `coupleId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `CoupleUser`;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_coupleId_fkey` FOREIGN KEY (`coupleId`) REFERENCES `Couple`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
