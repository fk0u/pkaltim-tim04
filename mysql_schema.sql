-- MySQL Database Schema for BorneoTrip
-- Generated based on Prisma Schema

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for User
-- ----------------------------
DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `role` varchar(191) NOT NULL DEFAULT 'client', -- 'client', 'mitra', 'admin'
  `onboardingCompleted` tinyint(1) NOT NULL DEFAULT 0,
  `preferences` json DEFAULT NULL, -- Stores: { interests: [], budget: "", travelStyle: "" }
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for Event
-- ----------------------------
DROP TABLE IF EXISTS `Event`;
CREATE TABLE `Event` (
  `id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `location` varchar(191) NOT NULL,
  `date` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `imageUrl` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL,
  `tags` json NOT NULL,
  `price` varchar(191) DEFAULT NULL,
  `organizer` varchar(191) DEFAULT NULL,
  `ticketCount` int DEFAULT 0,
  `schedule` json DEFAULT NULL,
  `gallery` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for TourPackage
-- ----------------------------
DROP TABLE IF EXISTS `TourPackage`;
CREATE TABLE `TourPackage` (
  `id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `duration` varchar(191) NOT NULL,
  `price` int NOT NULL,
  `location` varchar(191) NOT NULL,
  `rating` double NOT NULL,
  `ecoRating` int NOT NULL,
  `description` text NOT NULL,
  `imageUrl` varchar(191) NOT NULL,
  `facilities` json NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for ItineraryDetail
-- ----------------------------
DROP TABLE IF EXISTS `ItineraryDetail`;
CREATE TABLE `ItineraryDetail` (
  `id` varchar(191) NOT NULL,
  `packageId` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `badges` json NOT NULL,
  `days` json NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ItineraryDetail_packageId_key` (`packageId`),
  CONSTRAINT `ItineraryDetail_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `TourPackage` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for Booking
-- ----------------------------
DROP TABLE IF EXISTS `Booking`;
CREATE TABLE `Booking` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `eventId` varchar(191) DEFAULT NULL,
  `packageId` varchar(191) DEFAULT NULL,
  `date` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `status` varchar(191) NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`),
  KEY `Booking_userId_fkey` (`userId`),
  KEY `Booking_eventId_fkey` (`eventId`),
  KEY `Booking_packageId_fkey` (`packageId`),
  CONSTRAINT `Booking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Booking_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Booking_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `TourPackage` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for Testimonial
-- ----------------------------
DROP TABLE IF EXISTS `Testimonial`;
CREATE TABLE `Testimonial` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `role` varchar(191) NOT NULL,
  `avatarUrl` varchar(191) NOT NULL,
  `rating` int NOT NULL,
  `content` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for Region
-- ----------------------------
DROP TABLE IF EXISTS `Region`;
CREATE TABLE `Region` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `capital` varchar(191) NOT NULL,
  `leader` varchar(191) NOT NULL,
  `area` varchar(191) NOT NULL,
  `population` varchar(191) NOT NULL,
  `density` varchar(191) NOT NULL,
  `districts` int NOT NULL,
  `villages` varchar(191) NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `imageUrl` varchar(191) NOT NULL,
  `destinations` json NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
