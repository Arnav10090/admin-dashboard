/*
  Warnings:

  - You are about to drop the column `userId` on the `kpicard` table. All the data in the column will be lost.
  - You are about to drop the `kpivalue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userpreference` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `kpicard` DROP FOREIGN KEY `KpiCard_userId_fkey`;

-- DropForeignKey
ALTER TABLE `kpivalue` DROP FOREIGN KEY `KpiValue_cardId_fkey`;

-- DropIndex
DROP INDEX `KpiCard_userId_fkey` ON `kpicard`;

-- AlterTable
ALTER TABLE `kpicard` DROP COLUMN `userId`,
    ADD COLUMN `achieved` DOUBLE NULL,
    ADD COLUMN `date` DATETIME(3) NULL,
    ADD COLUMN `isDefault` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `timeFrame` VARCHAR(191) NULL,
    MODIFY `order` INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `kpivalue`;

-- DropTable
DROP TABLE `user`;

-- DropTable
DROP TABLE `userpreference`;
