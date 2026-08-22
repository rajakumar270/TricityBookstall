-- ====================================================================
-- EKATVA FOUNDATION — MYSQL DATABASE SCHEMA DEFINITION
-- Character Set: utf8mb4 (Full Devanagari Hindi & Emoji Support)
-- Collation: utf8mb4_unicode_ci
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. BOOKS INVENTORY MASTER TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `books` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `hinglish_title` VARCHAR(255) NULL,
  `author` VARCHAR(255) NOT NULL,
  `main_category` ENUM('Acharya Prashant Foundation', 'Other Author') NOT NULL DEFAULT 'Acharya Prashant Foundation',
  `category` ENUM('Kids Wisdom', 'Mind & Character', 'Self Discovery', 'Vedanta & Classics') NOT NULL DEFAULT 'Mind & Character',
  `is_kids_section` TINYINT(1) NOT NULL DEFAULT 0,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `language` ENUM('English', 'Hindi', 'Bilingual') NOT NULL DEFAULT 'Hindi',
  `description` TEXT NULL,
  `cover_image` VARCHAR(512) NOT NULL,
  `badge` VARCHAR(100) NULL,
  `reading_age` VARCHAR(50) NULL,
  `pages` INT NOT NULL DEFAULT 150,
  `mrp` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `buying_cost` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `selling_price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `available_stock` INT NOT NULL DEFAULT 0,
  `external_link` VARCHAR(512) NULL,
  `problem_addressed_tag` VARCHAR(255) NULL DEFAULT 'Personal Growth & Freedom',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_main_category` (`main_category`),
  INDEX `idx_category` (`category`),
  INDEX `idx_language` (`language`),
  INDEX `idx_kids` (`is_kids_section`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 2. SALES LOGS TABLE (DATE-WISE STALL SALES)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `sales_logs` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `sale_date` DATE NOT NULL,
  `book_id` VARCHAR(64) NOT NULL,
  `book_title` VARCHAR(255) NOT NULL,
  `main_category` VARCHAR(100) NOT NULL,
  `quantity_sold` INT NOT NULL DEFAULT 1,
  `selling_price_on_date` DECIMAL(10, 2) NOT NULL,
  `total_amount` DECIMAL(10, 2) NOT NULL,
  `recorded_by` VARCHAR(100) NOT NULL DEFAULT 'Stall Volunteer',
  `location` VARCHAR(255) NULL DEFAULT 'Tricity Stall',
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_sales_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 3. STALL REQUESTS TABLE (CAMPUS & PTM BOOKINGS)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `stall_requests` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `institution_name` VARCHAR(255) NOT NULL,
  `institution_type` ENUM('School', 'College', 'University', 'Public Event', 'Other') NOT NULL,
  `contact_person` VARCHAR(150) NOT NULL,
  `designation` VARCHAR(150) NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `city` ENUM('Chandigarh', 'Mohali', 'Panchkula', 'Other') NOT NULL,
  `event_location` VARCHAR(255) NOT NULL,
  `preferred_date` DATE NOT NULL,
  `estimated_footfall` VARCHAR(100) NULL,
  `additional_notes` TEXT NULL,
  `status` ENUM('Pending', 'Approved', 'Completed', 'Declined') NOT NULL DEFAULT 'Pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 4. YOUTH VOLUNTEER APPLICATIONS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `volunteer_applications` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `institution_or_org` VARCHAR(200) NULL,
  `availability` VARCHAR(100) NULL,
  `motivation` TEXT NULL,
  `status` ENUM('Pending', 'Contacted', 'Active') NOT NULL DEFAULT 'Pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 5. CAMPUS IMPACT GALLERY EVENTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `campus_events` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `event_date` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `category` ENUM('University Fest', 'School PTM', 'Book Fair', 'Youth Conference') NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 6. EVENT GALLERY SNAPSHOTS TABLE (ONE-TO-MANY WITH CAMPUS EVENTS)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `event_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_id` VARCHAR(64) NOT NULL,
  `image_url` VARCHAR(512) NOT NULL,
  `display_order` INT DEFAULT 0,
  CONSTRAINT `fk_event_image` FOREIGN KEY (`event_id`) REFERENCES `campus_events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 7. USERS AUTHENTICATION TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(150) NOT NULL,
  `role` ENUM('Admin', 'Volunteer') NOT NULL DEFAULT 'Volunteer',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 8. SITE CONFIGURATION & FEATURE TOGGLES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `site_settings` (
  `key_name` VARCHAR(100) NOT NULL PRIMARY KEY,
  `value_json` TEXT NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

