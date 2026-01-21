-- AlterTable
ALTER TABLE `event` MODIFY `description` TEXT NOT NULL,
    MODIFY `tags` TEXT NOT NULL,
    MODIFY `schedule` TEXT NULL,
    MODIFY `gallery` TEXT NULL;

-- AlterTable
ALTER TABLE `itinerarydetail` MODIFY `badges` TEXT NOT NULL,
    MODIFY `days` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `region` MODIFY `destinations` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `testimonial` MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `tourpackage` MODIFY `description` TEXT NOT NULL,
    MODIFY `facilities` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `preferences` TEXT NULL;
