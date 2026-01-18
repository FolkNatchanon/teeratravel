-- CreateTable
CREATE TABLE `User` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(30) NOT NULL,
    `user_fname` VARCHAR(30) NOT NULL,
    `user_lname` VARCHAR(30) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `role` CHAR(1) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `phone_number` CHAR(10) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_role_idx`(`role`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Boat` (
    `boat_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(80) NOT NULL,
    `capacity` INTEGER NOT NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',

    INDEX `Boat_status_idx`(`status`),
    PRIMARY KEY (`boat_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Package` (
    `package_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(120) NOT NULL,
    `cover_image_url` TEXT NOT NULL,
    `short_intro` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `duration_hours` DECIMAL(5, 2) NOT NULL,
    `type` ENUM('private', 'join') NOT NULL DEFAULT 'private',
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `base_member_count` INTEGER NOT NULL DEFAULT 10,
    `base_price` DECIMAL(10, 2) NOT NULL,
    `extra_price_per_person` DECIMAL(10, 2) NOT NULL,
    `boat_id` INTEGER NOT NULL,

    INDEX `Package_boat_id_idx`(`boat_id`),
    INDEX `Package_status_idx`(`status`),
    INDEX `Package_type_idx`(`type`),
    PRIMARY KEY (`package_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `booking_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `package_id` INTEGER NOT NULL,
    `boat_id` INTEGER NOT NULL,
    `trip_date` DATE NOT NULL,
    `time_slot` ENUM('morning', 'afternoon') NOT NULL,
    `passenger_count` INTEGER NOT NULL,
    `total_price` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('pending', 'complete', 'cancel') NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Booking_user_id_idx`(`user_id`),
    INDEX `Booking_package_id_idx`(`package_id`),
    INDEX `Booking_boat_id_idx`(`boat_id`),
    INDEX `Booking_trip_date_idx`(`trip_date`),
    INDEX `Booking_status_idx`(`status`),
    UNIQUE INDEX `Booking_boat_id_trip_date_time_slot_key`(`boat_id`, `trip_date`, `time_slot`),
    PRIMARY KEY (`booking_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Passenger` (
    `passenger_id` INTEGER NOT NULL AUTO_INCREMENT,
    `booking_id` INTEGER NOT NULL,
    `fname` VARCHAR(60) NOT NULL,
    `lname` VARCHAR(60) NOT NULL,
    `age` INTEGER NOT NULL,
    `gender` ENUM('male', 'female', 'other') NOT NULL,

    INDEX `Passenger_booking_id_idx`(`booking_id`),
    PRIMARY KEY (`passenger_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Package` ADD CONSTRAINT `Package_boat_id_fkey` FOREIGN KEY (`boat_id`) REFERENCES `Boat`(`boat_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_package_id_fkey` FOREIGN KEY (`package_id`) REFERENCES `Package`(`package_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_boat_id_fkey` FOREIGN KEY (`boat_id`) REFERENCES `Boat`(`boat_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Passenger` ADD CONSTRAINT `Passenger_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `Booking`(`booking_id`) ON DELETE CASCADE ON UPDATE CASCADE;
