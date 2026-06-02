-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: restaurantdb
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Món Chính'),(2,'Tráng Miệng'),(3,'Nước Uống');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dish`
--

DROP TABLE IF EXISTS `dish`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dish` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `description` text NOT NULL,
  `image` varchar(255) NOT NULL,
  `price` int DEFAULT '0',
  `time_prepare` int NOT NULL,
  `material` text NOT NULL,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `dish_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `dish_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dish`
--

LOCK TABLES `dish` WRITE;
/*!40000 ALTER TABLE `dish` DISABLE KEYS */;
INSERT INTO `dish` VALUES (1,4,1,'Bò Bít Tết','Thăn ngoại bò tươi','https://res.cloudinary.com/dpl8syyb9/image/upload/q_auto/f_auto/v1775356448/Screenshot_2026-04-05_093350_kggvyu.png',250000,20,'Thịt bò, muối, tiêu, bơ',1),(2,5,2,'Bánh Flan','Bánh mềm béo ngậy','https://res.cloudinary.com/dpl8syyb9/image/upload/q_auto/f_auto/v1775356448/Screenshot_2026-04-05_093338_rnktnb.png',35000,10,'Trứng, sữa, caramel',1),(3,4,3,'Nước Ép Cam','Cam vắt tươi','https://res.cloudinary.com/dpl8syyb9/image/upload/q_auto/f_auto/v1775356448/Screenshot_2026-04-05_093324_u5pfqp.png',40000,5,'Cam tươi, đường',1),(4,4,1,'Gỏi Ngó Sen','Khai vị nhẹ nhàng, thanh mát','https://res.cloudinary.com/dddils3j0/image/upload/v1780201517/Screenshot_2026-05-31_112443_el80je.png',85000,10,'Ngó sen, tôm, thịt ba chỉ, đậu phộng',1),(5,5,1,'Tôm Hùm Nướng Bơ Tỏi','Tôm hùm tươi sống nướng bơ tỏi','https://res.cloudinary.com/dddils3j0/image/upload/v1780201517/Screenshot_2026-05-31_112424_qxvzux.png',850000,25,'Tôm hùm, bơ, tỏi',1),(6,4,1,'Đậu Hũ Tứ Xuyên','Đậu hũ non sốt cay','https://res.cloudinary.com/dddils3j0/image/upload/v1780201517/Screenshot_2026-05-31_112402_p5fjrv.png',55000,15,'Đậu hũ non, nấm, sa tế',1),(7,5,1,'Lẩu Thái Tomyum','Lẩu chua cay hải sản','https://res.cloudinary.com/dddils3j0/image/upload/v1780201518/Screenshot_2026-05-31_112341_gfriq5.png',350000,20,'Hải sản, nấm, nước cốt dừa, lá chanh',1),(8,4,1,'Sườn Nướng BBQ','Sườn heo nướng sốt BBQ','https://res.cloudinary.com/dddils3j0/image/upload/v1780201517/Screenshot_2026-05-31_112316_fnrotg.png',180000,20,'Sườn non, sốt BBQ',1),(9,5,1,'Salad Cá Hồi','Salad cá hồi hun khói sốt chanh dây','https://res.cloudinary.com/dddils3j0/image/upload/v1780201517/Screenshot_2026-05-31_112301_wbh3t9.png',120000,10,'Cá hồi, xà lách, cà chua bi, chanh dây',1),(10,4,1,'Mực Xào Sa Tế','Mực ống tươi xào cay','https://res.cloudinary.com/dddils3j0/image/upload/v1780201517/Screenshot_2026-05-31_112241_ptrown.png',140000,15,'Mực, sa tế, hành tây',1),(11,5,1,'Canh Tom Yum','Canh chua cay kiểu Thái','https://res.cloudinary.com/dddils3j0/image/upload/v1780201517/Screenshot_2026-05-31_112220_lqdggb.png',95000,15,'Tôm, nấm rơm, sả, ớt',1),(12,4,3,'Bia Heineken','Bia chai ướp lạnh','https://res.cloudinary.com/dddils3j0/image/upload/v1780201516/Screenshot_2026-05-31_112200_xwybsv.png',25000,2,'Bia',1),(13,5,2,'Chè Khúc Bạch','Chè thanh mát giải nhiệt','https://res.cloudinary.com/dddils3j0/image/upload/v1780201517/Screenshot_2026-05-31_112141_-_Copy_uhi3ic.png',45000,5,'Sữa tươi, phô mai, hạnh nhân, nhãn',1);
/*!40000 ALTER TABLE `dish` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_detail`
--

DROP TABLE IF EXISTS `order_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_detail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `dish_id` int DEFAULT NULL,
  `quantity` int DEFAULT '1',
  `unit_price` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `dish_id` (`dish_id`),
  CONSTRAINT `order_detail_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_detail_ibfk_2` FOREIGN KEY (`dish_id`) REFERENCES `dish` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_detail`
--

LOCK TABLES `order_detail` WRITE;
/*!40000 ALTER TABLE `order_detail` DISABLE KEYS */;
INSERT INTO `order_detail` VALUES (1,1,1,1,250000),(2,1,3,1,40000),(3,2,2,2,35000),(4,3,3,1,40000),(5,3,2,1,35000),(6,4,3,1,40000),(7,4,2,1,35000),(8,5,3,1,40000),(9,5,2,1,35000),(10,6,10,1,140000),(11,6,11,1,95000),(12,6,3,1,40000);
/*!40000 ALTER TABLE `order_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `reservation_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `payment_method` enum('MOMO','ZALO_PAY','CASH') DEFAULT NULL,
  `total_price` int DEFAULT '0',
  `status_pay` enum('CANCELED','PENDING','COMPLETED') DEFAULT NULL,
  `status_order` enum('PENDING','COMPLETED') DEFAULT NULL,
  `transaction_id` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reservation_id` (`reservation_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,2,1,'2026-04-04 21:39:23','MOMO',290000,'COMPLETED','COMPLETED',NULL),(2,3,2,'2026-04-04 21:39:23','CASH',70000,'COMPLETED','PENDING',NULL),(3,6,NULL,'2026-05-31 10:39:38','MOMO',75000,'COMPLETED',NULL,NULL),(4,6,NULL,'2026-05-31 10:43:56','MOMO',75000,'CANCELED',NULL,'4754065079'),(5,5,NULL,'2026-05-31 11:03:33','CASH',75000,'COMPLETED',NULL,NULL),(6,4,NULL,'2026-05-31 11:33:45','CASH',275000,'COMPLETED',NULL,NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rating`
--

DROP TABLE IF EXISTS `rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rating` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `dish_id` int DEFAULT NULL,
  `point` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `content` text,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `dish_id` (`dish_id`),
  CONSTRAINT `rating_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `rating_ibfk_2` FOREIGN KEY (`dish_id`) REFERENCES `dish` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rating`
--

LOCK TABLES `rating` WRITE;
/*!40000 ALTER TABLE `rating` DISABLE KEYS */;
INSERT INTO `rating` VALUES (1,2,1,5,'2026-04-04 21:39:23','Bò mềm, sốt ngon'),(2,3,2,4,'2026-04-04 21:39:23','Bánh hơi ngọt');
/*!40000 ALTER TABLE `rating` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `table_id` int DEFAULT NULL,
  `start_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `end_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `number_people` int NOT NULL,
  `status` enum('RESERVED','COMPLETED','CANCELLED') DEFAULT NULL,
  `customer_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `table_id` (`table_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`table_id`) REFERENCES `restaurant_table` (`id`),
  CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation`
--

LOCK TABLES `reservation` WRITE;
/*!40000 ALTER TABLE `reservation` DISABLE KEYS */;
INSERT INTO `reservation` VALUES (1,2,1,'2026-04-10 18:00:00','2026-04-10 20:00:00','2026-04-04 21:39:23',2,'COMPLETED',NULL),(2,3,2,'2026-04-11 19:00:00','2026-04-11 21:00:00','2026-04-04 21:39:23',4,'COMPLETED',NULL),(3,NULL,2,'2026-05-30 15:34:33','2026-05-30 17:34:33','2026-05-30 15:34:33',1,'COMPLETED','Cong'),(4,NULL,1,'2026-05-30 15:35:34','2026-05-30 17:35:34','2026-05-30 15:35:34',1,'COMPLETED','1'),(6,NULL,1,'2026-05-30 15:44:54','2026-05-30 17:44:54','2026-05-30 15:44:54',2,'COMPLETED','Cozg'),(7,NULL,1,'2026-05-30 15:45:21','2026-05-30 17:45:21','2026-05-30 15:45:21',1,'COMPLETED','2'),(8,NULL,1,'2026-05-30 15:45:30','2026-05-30 17:45:30','2026-05-30 15:45:30',1,'COMPLETED','3');
/*!40000 ALTER TABLE `reservation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restaurant_table`
--

DROP TABLE IF EXISTS `restaurant_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurant_table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `capacity` int DEFAULT '2',
  `table_number` varchar(10) NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurant_table`
--

LOCK TABLES `restaurant_table` WRITE;
/*!40000 ALTER TABLE `restaurant_table` DISABLE KEYS */;
INSERT INTO `restaurant_table` VALUES (1,2,'T01',NULL,1),(2,4,'T02',NULL,1),(3,6,'T03',NULL,1),(4,2,'T04',NULL,1),(5,4,'T05',NULL,1),(6,8,'T06',NULL,1),(7,2,'T07',NULL,1),(8,4,'T08',NULL,1),(9,10,'VIP01','Tầng 2',1),(10,10,'VIP02','Tầng 2',1),(11,6,'T09',NULL,1),(12,6,'T10',NULL,1),(13,2,'T11',NULL,1);
/*!40000 ALTER TABLE `restaurant_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `phone` varchar(12) NOT NULL,
  `avatar` varchar(255) NOT NULL,
  `user_role` enum('ROLE_USER','ROLE_ADMIN','ROLE_CHEF') DEFAULT NULL,
  `active` tinyint(1) DEFAULT '0',
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','$2a$10$ZI1RXsvWPp.uM/y2JvwsB.B2OAaXW2Hl9tPqEsnL3rCtV6iFCTVEK','Nguyễn','Quản Trị','0901234567','https://res.cloudinary.com/dpl8syyb9/image/upload/v1774107595/dqu87moys1yoyhvmcjkp.png','ROLE_ADMIN',0,''),(2,'khach1','$2a$10$ZI1RXsvWPp.uM/y2JvwsB.B2OAaXW2Hl9tPqEsnL3rCtV6iFCTVEK','Trần','Khách Một','0902345678','https://res.cloudinary.com/dpl8syyb9/image/upload/v1774107595/dqu87moys1yoyhvmcjkp.png','ROLE_CHEF',1,''),(3,'khach2','$2a$10$ZI1RXsvWPp.uM/y2JvwsB.B2OAaXW2Hl9tPqEsnL3rCtV6iFCTVEK','Lê','Khách Hai','0903456789','https://res.cloudinary.com/dpl8syyb9/image/upload/v1774107595/dqu87moys1yoyhvmcjkp.png','ROLE_CHEF',1,''),(4,'bep1','$2a$10$ZI1RXsvWPp.uM/y2JvwsB.B2OAaXW2Hl9tPqEsnL3rCtV6iFCTVEK','Phạm','Đầu Bếp Nhất','0904567890','https://res.cloudinary.com/dpl8syyb9/image/upload/v1774107595/dqu87moys1yoyhvmcjkp.png','ROLE_CHEF',1,''),(5,'bep2','$2a$10$ZI1RXsvWPp.uM/y2JvwsB.B2OAaXW2Hl9tPqEsnL3rCtV6iFCTVEK','Vũ','Đầu Bếp Nhì','0905678901','https://res.cloudinary.com/dpl8syyb9/image/upload/v1774107595/dqu87moys1yoyhvmcjkp.png','ROLE_CHEF',0,''),(6,'canh','$2a$10$ZI1RXsvWPp.uM/y2JvwsB.B2OAaXW2Hl9tPqEsnL3rCtV6iFCTVEK','canh','huynh','0969293472','https://res.cloudinary.com/dpl8syyb9/image/upload/v1775355990/l5gfpdyfajuzf1xdacoe.png','ROLE_USER',0,''),(7,'khach3','$2a$10$ZI1RXsvWPp.uM/y2JvwsB.B2OAaXW2Hl9tPqEsnL3rCtV6iFCTVEK','Đinh','Khách Ba','0911111111','https://res.cloudinary.com/demo/image.png','ROLE_USER',1,''),(8,'khach4','$2a$10$ZI1RXsvWPp.uM/y2JvwsB.B2OAaXW2Hl9tPqEsnL3rCtV6iFCTVEK','Lý','Khách Bốn','0922222222','https://res.cloudinary.com/demo/image.png','ROLE_USER',1,''),(9,'khach5','$2a$10$ZI1RXsvWPp.uM/y2JvwsB.B2OAaXW2Hl9tPqEsnL3rCtV6iFCTVEK','Vương','Khách Năm','0933333333','https://res.cloudinary.com/demo/image.png','ROLE_USER',1,''),(10,'khach6','$2a$10$ZI1RXsvWPp.uM/y2JvwsB.B2OAaXW2Hl9tPqEsnL3rCtV6iFCTVEK','Mai','Khách Sáu','0944444444','https://res.cloudinary.com/demo/image.png','ROLE_USER',1,''),(11,'khach7','$2a$10$ZI1RXsvWPp.uM/y2JvwsB.B2OAaXW2Hl9tPqEsnL3rCtV6iFCTVEK','Châu','Khách Bảy','0955555555','https://res.cloudinary.com/demo/image.png','ROLE_USER',1,''),(12,'khach8','$2a$10$ZI1RXsvWPp.uM/y2JvwsB.B2OAaXW2Hl9tPqEsnL3rCtV6iFCTVEK','Bùi','Khách Tám','0966666666','https://res.cloudinary.com/demo/image.png','ROLE_USER',1,''),(13,'khach9','$2a$10$ZI1RXsvWPp.uM/y2JvwsB.B2OAaXW2Hl9tPqEsnL3rCtV6iFCTVEK','Dương','Khách Chín','0977777777','https://res.cloudinary.com/demo/image.png','ROLE_USER',1,''),(14,'khach10','$2a$10$ZI1RXsvWPp.uM/y2JvwsB.B2OAaXW2Hl9tPqEsnL3rCtV6iFCTVEK','Đỗ','Khách Mười','0988888888','https://res.cloudinary.com/demo/image.png','ROLE_USER',1,''),(15,'bep3','$2a$10$ZI1RXsvWPp.uM/y2JvwsB.B2OAaXW2Hl9tPqEsnL3rCtV6iFCTVEK','Trịnh','Đầu Bếp Ba','0999999999','https://res.cloudinary.com/demo/image.png','ROLE_CHEF',1,''),(16,'bep4','$2a$10$ZI1RXsvWPp.uM/y2JvwsB.B2OAaXW2Hl9tPqEsnL3rCtV6iFCTVEK','Hồ','Đầu Bếp Bốn','0900000000','https://res.cloudinary.com/demo/image.png','ROLE_CHEF',1,'');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-31 20:56:23
