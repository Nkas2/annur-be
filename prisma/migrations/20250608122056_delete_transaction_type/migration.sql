/*
  Warnings:

  - You are about to alter the column `event_start` on the `events` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `event_end` on the `events` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `schedule` on the `prayer_schedule` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `type_id` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the `transaction_type` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `transactions_type_id_fkey`;

-- DropIndex
DROP INDEX `transactions_type_id_fkey` ON `transactions`;

-- AlterTable
ALTER TABLE `events` MODIFY `event_start` DATETIME NOT NULL,
    MODIFY `event_end` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `prayer_schedule` MODIFY `schedule` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `transactions` DROP COLUMN `type_id`;

-- DropTable
DROP TABLE `transaction_type`;
