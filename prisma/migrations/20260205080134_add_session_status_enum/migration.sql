/*
  Warnings:

  - The values [inactive] on the enum `JoinSession_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `JoinSession` MODIFY `status` ENUM('active', 'closed', 'finished', 'cancelled') NOT NULL DEFAULT 'active';
