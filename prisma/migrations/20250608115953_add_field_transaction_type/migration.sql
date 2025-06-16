/*
  Warnings:

  - You are about to alter the column `event_start` on the `events` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `event_end` on the `events` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `schedule` on the `prayer_schedule` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `transaction_type` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `events` MODIFY `event_start` DATETIME NOT NULL,
    MODIFY `event_end` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `prayer_schedule` MODIFY `schedule` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `transaction_type` VARCHAR(100) NOT NULL;
