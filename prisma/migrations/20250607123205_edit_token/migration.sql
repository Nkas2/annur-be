/*
  Warnings:

  - You are about to alter the column `event_start` on the `events` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `event_end` on the `events` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `schedule` on the `prayer_schedule` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `tokem` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `events` MODIFY `event_start` DATETIME NOT NULL,
    MODIFY `event_end` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `prayer_schedule` MODIFY `schedule` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `tokem`,
    ADD COLUMN `token` VARCHAR(255) NULL;
