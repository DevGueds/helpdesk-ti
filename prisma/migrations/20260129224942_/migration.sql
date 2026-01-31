-- AlterTable
ALTER TABLE `category` ADD COLUMN `defaultPriority` ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') NOT NULL DEFAULT 'MEDIUM',
    ADD COLUMN `slaHours` INTEGER NULL;
