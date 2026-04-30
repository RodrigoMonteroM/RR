-- AlterTable
ALTER TABLE `User` MODIFY `resetToken` VARCHAR(191) NULL,
    MODIFY `resetTokenExpirity` DATETIME(3) NULL;
