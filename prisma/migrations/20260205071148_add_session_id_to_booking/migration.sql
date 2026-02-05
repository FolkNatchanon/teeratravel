-- DropIndex
DROP INDEX `Booking_boat_id_trip_date_time_slot_key` ON `Booking`;

-- AlterTable
ALTER TABLE `Booking` ADD COLUMN `session_id` INTEGER NULL,
    MODIFY `status` ENUM('pending', 'complete', 'cancel', 'finished') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `Package` ADD COLUMN `keywords` VARCHAR(255) NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE `Staff` (
    `staff_id` INTEGER NOT NULL AUTO_INCREMENT,
    `fname` VARCHAR(60) NOT NULL,
    `lname` VARCHAR(60) NOT NULL,
    `role` ENUM('captain', 'staff') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`staff_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JoinSession` (
    `session_id` INTEGER NOT NULL AUTO_INCREMENT,
    `package_id` INTEGER NOT NULL,
    `trip_date` DATE NOT NULL,
    `time_slot` ENUM('morning', 'afternoon') NOT NULL,
    `max_capacity` INTEGER NOT NULL,
    `current_bookings` INTEGER NOT NULL DEFAULT 0,
    `price_per_person` DECIMAL(10, 2) NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `JoinSession_package_id_idx`(`package_id`),
    INDEX `JoinSession_trip_date_idx`(`trip_date`),
    UNIQUE INDEX `JoinSession_package_id_trip_date_time_slot_key`(`package_id`, `trip_date`, `time_slot`),
    PRIMARY KEY (`session_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_BookingToStaff` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_BookingToStaff_AB_unique`(`A`, `B`),
    INDEX `_BookingToStaff_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_JoinSessionToStaff` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_JoinSessionToStaff_AB_unique`(`A`, `B`),
    INDEX `_JoinSessionToStaff_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Booking_session_id_idx` ON `Booking`(`session_id`);

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `JoinSession`(`session_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JoinSession` ADD CONSTRAINT `JoinSession_package_id_fkey` FOREIGN KEY (`package_id`) REFERENCES `Package`(`package_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BookingToStaff` ADD CONSTRAINT `_BookingToStaff_A_fkey` FOREIGN KEY (`A`) REFERENCES `Booking`(`booking_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BookingToStaff` ADD CONSTRAINT `_BookingToStaff_B_fkey` FOREIGN KEY (`B`) REFERENCES `Staff`(`staff_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_JoinSessionToStaff` ADD CONSTRAINT `_JoinSessionToStaff_A_fkey` FOREIGN KEY (`A`) REFERENCES `JoinSession`(`session_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_JoinSessionToStaff` ADD CONSTRAINT `_JoinSessionToStaff_B_fkey` FOREIGN KEY (`B`) REFERENCES `Staff`(`staff_id`) ON DELETE CASCADE ON UPDATE CASCADE;
