-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Mar 21, 2025 at 01:00 PM
-- Server version: 8.2.0
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sd2-db`
--

-- --------------------------------------------------------

--
-- Table structure for table `contact_us`
--

CREATE TABLE `contact_us` (
  `contact_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `contact_us`
--

INSERT INTO `contact_us` (`contact_id`, `user_id`, `message`, `created_at`) VALUES
(1, 1, 'I want to know more about your upcycling process.', '2025-03-21 02:54:43'),
(2, 2, 'How can I donate clothes to your platform?', '2025-03-21 02:54:43'),
(3, 3, 'I am interested in purchasing eco-friendly sneakers.', '2025-03-21 02:54:43'),
(4, 4, 'Can I get a discount on recycled denim jackets?', '2025-03-21 02:54:43'),
(5, 5, 'How do I track the environmental impact of my donations?', '2025-03-21 02:54:43');

-- --------------------------------------------------------

--
-- Table structure for table `donations`
--

CREATE TABLE `donations` (
  `donation_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `quantity` int NOT NULL,
  `status` enum('Pending','Collected','Upcycled') DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `donations`
--

INSERT INTO `donations` (`donation_id`, `user_id`, `item_id`, `quantity`, `status`, `created_at`) VALUES
(1, 1, 1, 2, 'Pending', '2025-03-21 02:54:34'),
(2, 2, 2, 1, 'Collected', '2025-03-21 02:54:34'),
(3, 3, 3, 5, 'Upcycled', '2025-03-21 02:54:34'),
(4, 4, 4, 3, 'Pending', '2025-03-21 02:54:34'),
(5, 5, 5, 4, 'Collected', '2025-03-21 02:54:34');

-- --------------------------------------------------------

--
-- Table structure for table `fashion_items`
--

CREATE TABLE `fashion_items` (
  `item_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `category` varchar(50) DEFAULT NULL,
  `condition` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `fashion_items`
--

INSERT INTO `fashion_items` (`item_id`, `user_id`, `title`, `description`, `category`, `condition`, `price`, `image_url`, `created_at`) VALUES
(1, 1, 'Vintage Blue Shirt', 'A stylish and eco-friendly shirt made from organic cotton.', 'Shirt', 'used', 49.99, 'Vintage_Blue_Shirt.jpg', '2025-03-21 02:54:15'),
(2, 2, 'Handmade Leather Bag', 'A premium quality upcycled leather bag with a unique design.', 'Bag', 'upcycled', 149.99, 'Handmade_Leather_Bag.avif', '2025-03-21 02:54:15'),
(3, 3, 'Eco-friendly Sneakers', 'Comfortable sneakers made from recycled materials.', 'Shoes', 'new', 89.99, 'opumo-cariuma-2.avif', '2025-03-21 02:54:15'),
(4, 4, 'Recycled Denim Jacket', 'A trendy denim jacket made from recycled fabric.', 'Jacket', 'used', 79.99, 'w2000_q60.avif', '2025-03-21 02:54:15'),
(5, 5, 'Upcycled Wool Scarf', 'A warm scarf made from upcycled wool.', 'Scarf', 'upcycled', 9.99, 'wool_Scarf.webp', '2025-03-21 02:54:15');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password_hash`, `phone_number`, `created_at`) VALUES
(1, 'Rahul', 'Sharma', 'rahul.sharma@example.com', 'hashedpassword1', '9876543210', '2025-03-21 02:54:01'),
(2, 'Priya', 'Verma', 'priya.verma@example.com', 'hashedpassword2', '9876543211', '2025-03-21 02:54:01'),
(3, 'Ankit', 'Singh', 'ankit.singh@example.com', 'hashedpassword3', '9876543212', '2025-03-21 02:54:01'),
(4, 'Neha', 'Kumar', 'neha.kumar@example.com', 'hashedpassword4', '9876543213', '2025-03-21 02:54:01'),
(5, 'Aarti', 'Gupta', 'aarti.gupta@example.com', 'hashedpassword5', '9876543214', '2025-03-21 02:54:01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contact_us`
--
ALTER TABLE `contact_us`
  ADD PRIMARY KEY (`contact_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `donations`
--
ALTER TABLE `donations`
  ADD PRIMARY KEY (`donation_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `fashion_items`
--
ALTER TABLE `fashion_items`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contact_us`
--
ALTER TABLE `contact_us`
  MODIFY `contact_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `donations`
--
ALTER TABLE `donations`
  MODIFY `donation_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `fashion_items`
--
ALTER TABLE `fashion_items`
  MODIFY `item_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `contact_us`
--
ALTER TABLE `contact_us`
  ADD CONSTRAINT `contact_us_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `donations`
--
ALTER TABLE `donations`
  ADD CONSTRAINT `donations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `donations_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `fashion_items` (`item_id`);

--
-- Constraints for table `fashion_items`
--
ALTER TABLE `fashion_items`
  ADD CONSTRAINT `fashion_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
