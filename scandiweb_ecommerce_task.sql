-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: scandiweb_ecommerce_task
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attributes`
--

DROP TABLE IF EXISTS `attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attributes` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_attribute` (`name`,`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attributes`
--

LOCK TABLES `attributes` WRITE;
/*!40000 ALTER TABLE `attributes` DISABLE KEYS */;
INSERT INTO `attributes` VALUES ('capacity','capacity','text'),('color','color','swatch'),('size','size','text'),('Touch ID in keyboard','Touch ID in keyboard','text'),('With USB 3 ports','With USB 3 ports','text');
/*!40000 ALTER TABLE `attributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES ('all'),('clothes'),('tech');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `currencies`
--

DROP TABLE IF EXISTS `currencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `currencies` (
  `label` varchar(50) NOT NULL,
  `symbol` varchar(10) NOT NULL,
  PRIMARY KEY (`label`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `currencies`
--

LOCK TABLES `currencies` WRITE;
/*!40000 ALTER TABLE `currencies` DISABLE KEYS */;
INSERT INTO `currencies` VALUES ('EUR','€'),('USD','$');
/*!40000 ALTER TABLE `currencies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `product_id` varchar(255) DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `attribute_values` json NOT NULL,
  `quantity` int unsigned DEFAULT '1',
  `paid_amount` decimal(10,2) NOT NULL,
  `paid_currency` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (16,14,'ps-5','PlayStation 5','{\"color\": \"Green\", \"capacity\": \"512G\"}',1,844.02,'USD','2024-08-03 14:38:46','2024-08-03 14:38:46'),(17,15,'apple-iphone-12-pro','iPhone 12 Pro','{\"color\": \"Black\", \"capacity\": \"1T\"}',1,1000.76,'USD','2024-08-03 14:39:19','2024-08-03 14:39:19'),(18,15,'apple-iphone-12-pro','iPhone 12 Pro','{\"color\": \"Blue\", \"capacity\": \"512G\"}',1,1000.76,'USD','2024-08-03 14:39:19','2024-08-03 14:39:19'),(19,16,'apple-airtag','AirTag','[]',1,120.57,'USD','2024-08-03 14:39:54','2024-08-03 14:39:54'),(20,17,'ps-5','PlayStation 5','{\"color\": \"Green\", \"capacity\": \"512G\"}',1,844.02,'USD','2024-08-04 09:48:20','2024-08-04 09:48:20'),(22,19,'apple-airtag','AirTag','[]',1,120.57,'USD','2024-08-05 10:39:53','2024-08-05 10:39:53'),(23,20,'apple-iphone-12-pro','iPhone 12 Pro','{\"color\": \"Green\", \"capacity\": \"1T\"}',2,2001.52,'USD','2024-08-05 10:40:18','2024-08-05 10:40:18'),(24,21,'apple-airtag','AirTag','[]',1,120.57,'USD','2024-08-05 10:43:15','2024-08-05 10:43:15'),(25,22,'apple-airtag','AirTag','[]',1,120.57,'USD','2024-08-14 10:07:22','2024-08-14 10:07:22'),(26,22,'ps-5','PlayStation 5','{\"color\": \"Green\", \"capacity\": \"512G\"}',1,844.02,'USD','2024-08-14 10:07:22','2024-08-14 10:07:22'),(27,23,'apple-airtag','AirTag','[]',1,120.57,'USD','2024-08-14 10:07:27','2024-08-14 10:07:27'),(28,23,'ps-5','PlayStation 5','{\"color\": \"Green\", \"capacity\": \"512G\"}',1,844.02,'USD','2024-08-14 10:07:27','2024-08-14 10:07:27');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `total_amount` decimal(10,2) NOT NULL,
  `total_currency` varchar(50) NOT NULL,
  `status` enum('pending','processing','shipped','delivered') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (14,844.02,'USD','pending','2024-08-03 14:38:46','2024-08-03 14:38:46'),(15,2001.52,'USD','pending','2024-08-03 14:39:19','2024-08-03 14:39:19'),(16,120.57,'USD','pending','2024-08-03 14:39:54','2024-08-03 14:39:54'),(17,844.02,'USD','pending','2024-08-04 09:48:20','2024-08-04 09:48:20'),(19,120.57,'USD','pending','2024-08-05 10:39:53','2024-08-05 10:39:53'),(20,2001.52,'USD','pending','2024-08-05 10:40:18','2024-08-05 10:40:18'),(21,120.57,'USD','pending','2024-08-05 10:43:15','2024-08-05 10:43:15'),(22,964.59,'USD','pending','2024-08-14 10:07:22','2024-08-14 10:07:22'),(23,964.59,'USD','pending','2024-08-14 10:07:27','2024-08-14 10:07:27');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prices`
--

DROP TABLE IF EXISTS `prices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prices` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `amount` decimal(10,2) DEFAULT NULL,
  `currency` varchar(50) NOT NULL,
  `product_id` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_product_price_currency` (`product_id`,`currency`),
  KEY `currency` (`currency`),
  CONSTRAINT `prices_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `prices_ibfk_2` FOREIGN KEY (`currency`) REFERENCES `currencies` (`label`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prices`
--

LOCK TABLES `prices` WRITE;
/*!40000 ALTER TABLE `prices` DISABLE KEYS */;
INSERT INTO `prices` VALUES (1,144.69,'USD','huarache-x-stussy-le'),(2,518.47,'USD','jacket-canada-goosee'),(3,844.02,'USD','ps-5'),(4,333.99,'USD','xbox-series-s'),(5,1600.00,'USD','apple-imac-2021'),(6,1000.76,'USD','apple-iphone-12-pro'),(7,300.00,'USD','apple-airpods-pro'),(8,120.57,'USD','apple-airtag');
/*!40000 ALTER TABLE `prices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_attributes`
--

DROP TABLE IF EXISTS `product_attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_attributes` (
  `id` varchar(255) NOT NULL,
  `product_id` varchar(255) NOT NULL,
  `attribute_id` varchar(255) DEFAULT NULL,
  `displayValue` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_product_attribute_value` (`product_id`,`attribute_id`,`value`),
  KEY `attribute_id` (`attribute_id`),
  CONSTRAINT `product_attributes_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_attributes_ibfk_2` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_attributes`
--

LOCK TABLES `product_attributes` WRITE;
/*!40000 ALTER TABLE `product_attributes` DISABLE KEYS */;
INSERT INTO `product_attributes` VALUES ('apple-imac-2021-capacity-256GB','apple-imac-2021','capacity','256GB','256GB'),('apple-imac-2021-capacity-512GB','apple-imac-2021','capacity','512GB','512GB'),('apple-imac-2021-Touch ID in keyboard-No','apple-imac-2021','Touch ID in keyboard','No','No'),('apple-imac-2021-Touch ID in keyboard-Yes','apple-imac-2021','Touch ID in keyboard','Yes','Yes'),('apple-imac-2021-With USB 3 ports-No','apple-imac-2021','With USB 3 ports','No','No'),('apple-imac-2021-With USB 3 ports-Yes','apple-imac-2021','With USB 3 ports','Yes','Yes'),('apple-iphone-12-pro-capacity-1T','apple-iphone-12-pro','capacity','1T','1T'),('apple-iphone-12-pro-capacity-512G','apple-iphone-12-pro','capacity','512G','512G'),('apple-iphone-12-pro-color-Black','apple-iphone-12-pro','color','Black','#000000'),('apple-iphone-12-pro-color-Blue','apple-iphone-12-pro','color','Blue','#030BFF'),('apple-iphone-12-pro-color-Cyan','apple-iphone-12-pro','color','Cyan','#03FFF7'),('apple-iphone-12-pro-color-Green','apple-iphone-12-pro','color','Green','#44FF03'),('apple-iphone-12-pro-color-White','apple-iphone-12-pro','color','White','#FFFFFF'),('huarache-x-stussy-le-size-40','huarache-x-stussy-le','size','40','40'),('huarache-x-stussy-le-size-41','huarache-x-stussy-le','size','41','41'),('huarache-x-stussy-le-size-42','huarache-x-stussy-le','size','42','42'),('huarache-x-stussy-le-size-43','huarache-x-stussy-le','size','43','43'),('jacket-canada-goosee-size-Extra Large','jacket-canada-goosee','size','Extra Large','XL'),('jacket-canada-goosee-size-Large','jacket-canada-goosee','size','Large','L'),('jacket-canada-goosee-size-Medium','jacket-canada-goosee','size','Medium','M'),('jacket-canada-goosee-size-Small','jacket-canada-goosee','size','Small','S'),('ps-5-capacity-1T','ps-5','capacity','1T','1T'),('ps-5-capacity-512G','ps-5','capacity','512G','512G'),('ps-5-color-Black','ps-5','color','Black','#000000'),('ps-5-color-Blue','ps-5','color','Blue','#030BFF'),('ps-5-color-Cyan','ps-5','color','Cyan','#03FFF7'),('ps-5-color-Green','ps-5','color','Green','#44FF03'),('ps-5-color-White','ps-5','color','White','#FFFFFF'),('xbox-series-s-capacity-1T','xbox-series-s','capacity','1T','1T'),('xbox-series-s-capacity-512G','xbox-series-s','capacity','512G','512G'),('xbox-series-s-color-Black','xbox-series-s','color','Black','#000000'),('xbox-series-s-color-Blue','xbox-series-s','color','Blue','#030BFF'),('xbox-series-s-color-Cyan','xbox-series-s','color','Cyan','#03FFF7'),('xbox-series-s-color-Green','xbox-series-s','color','Green','#44FF03'),('xbox-series-s-color-White','xbox-series-s','color','White','#FFFFFF');
/*!40000 ALTER TABLE `product_attributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `inStock` tinyint(1) DEFAULT '1',
  `gallery` json DEFAULT NULL,
  `description` text,
  `category` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category` (`category`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category`) REFERENCES `categories` (`name`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('apple-airpods-pro','AirPods Pro',0,'[\"https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MWP22?wid=572&hei=572&fmt=jpeg&qlt=95&.v=1591634795000\"]',' <h3>Magic like you’ve never heard</h3> <p>AirPods Pro have been designed to deliver Active Noise Cancellation for immersive sound, Transparency mode so you can hear your surroundings, and a customizable fit for all-day comfort. Just like AirPods, AirPods Pro connect magically to your iPhone or Apple Watch. And they’re ready to use right out of the case. <h3>Active Noise Cancellation</h3> <p>Incredibly light noise-cancelling headphones, AirPods Pro block out your environment so you can focus on what you’re listening to. AirPods Pro use two microphones, an outward-facing microphone and an inward-facing microphone, to create superior noise cancellation. By continuously adapting to the geometry of your ear and the fit of the ear tips, Active Noise Cancellation silences the world to keep you fully tuned in to your music, podcasts, and calls. <h3>Transparency mode</h3> <p>Switch to Transparency mode and AirPods Pro let the outside sound in, allowing you to hear and connect to your surroundings. Outward- and inward-facing microphones enable AirPods Pro to undo the sound-isolating effect of the silicone tips so things sound and feel natural, like when you’re talking to people around you.</p> <h3>All-new design</h3> <p>AirPods Pro offer a more customizable fit with three sizes of flexible silicone tips to choose from. With an internal taper, they conform to the shape of your ear, securing your AirPods Pro in place and creating an exceptional seal for superior noise cancellation.</p> <h3>Amazing audio quality</h3> <p>A custom-built high-excursion, low-distortion driver delivers powerful bass. A superefficient high dynamic range amplifier produces pure, incredibly clear sound while also extending battery life. And Adaptive EQ automatically tunes music to suit the shape of your ear for a rich, consistent listening experience.</p> <h3>Even more magical</h3> <p>The Apple-designed H1 chip delivers incredibly low audio latency. A force sensor on the stem makes it easy to control music and calls and switch between Active Noise Cancellation and Transparency mode. Announce Messages with Siri gives you the option to have Siri read your messages through your AirPods. And with Audio Sharing, you and a friend can share the same audio stream on two sets of AirPods — so you can play a game, watch a movie, or listen to a song together.</p> ','tech','Apple'),('apple-airtag','AirTag',1,'[\"https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airtag-double-select-202104?wid=445&hei=370&fmt=jpeg&qlt=95&.v=1617761672000\"]',' <h1>Lose your knack for losing things.</h1> <p>AirTag is an easy way to keep track of your stuff. Attach one to your keys, slip another one in your backpack. And just like that, they’re on your radar in the Find My app. AirTag has your back.</p> ','tech','Apple'),('apple-imac-2021','iMac 2021',1,'[\"https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/imac-24-blue-selection-hero-202104?wid=904&hei=840&fmt=jpeg&qlt=80&.v=1617492405000\"]','The new iMac!','tech','Apple'),('apple-iphone-12-pro','iPhone 12 Pro',1,'[\"https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-12-pro-family-hero?wid=940&amp;hei=1112&amp;fmt=jpeg&amp;qlt=80&amp;.v=1604021663000\"]','This is iPhone 12. Nothing else to say.','tech','Apple'),('huarache-x-stussy-le','Nike Air Huarache Le',1,'[\"https://cdn.shopify.com/s/files/1/0087/6193/3920/products/DD1381200_DEOA_2_720x.jpg?v=1612816087\", \"https://cdn.shopify.com/s/files/1/0087/6193/3920/products/DD1381200_DEOA_1_720x.jpg?v=1612816087\", \"https://cdn.shopify.com/s/files/1/0087/6193/3920/products/DD1381200_DEOA_3_720x.jpg?v=1612816087\", \"https://cdn.shopify.com/s/files/1/0087/6193/3920/products/DD1381200_DEOA_5_720x.jpg?v=1612816087\", \"https://cdn.shopify.com/s/files/1/0087/6193/3920/products/DD1381200_DEOA_4_720x.jpg?v=1612816087\"]','<p>Great sneakers for everyday use!</p>','clothes','Nike x Stussy'),('jacket-canada-goosee','Jacket',1,'[\"https://images.canadagoose.com/image/upload/w_480,c_scale,f_auto,q_auto:best/v1576016105/product-image/2409L_61.jpg\", \"https://images.canadagoose.com/image/upload/w_480,c_scale,f_auto,q_auto:best/v1576016107/product-image/2409L_61_a.jpg\", \"https://images.canadagoose.com/image/upload/w_480,c_scale,f_auto,q_auto:best/v1576016108/product-image/2409L_61_b.jpg\", \"https://images.canadagoose.com/image/upload/w_480,c_scale,f_auto,q_auto:best/v1576016109/product-image/2409L_61_c.jpg\", \"https://images.canadagoose.com/image/upload/w_480,c_scale,f_auto,q_auto:best/v1576016110/product-image/2409L_61_d.jpg\", \"https://images.canadagoose.com/image/upload/w_1333,c_scale,f_auto,q_auto:best/v1634058169/product-image/2409L_61_o.png\", \"https://images.canadagoose.com/image/upload/w_1333,c_scale,f_auto,q_auto:best/v1634058159/product-image/2409L_61_p.png\"]','<p>Awesome winter jacket</p>','clothes','Canada Goose'),('ps-5','PlayStation 5',1,'[\"https://images-na.ssl-images-amazon.com/images/I/510VSJ9mWDL._SL1262_.jpg\", \"https://images-na.ssl-images-amazon.com/images/I/610%2B69ZsKCL._SL1500_.jpg\", \"https://images-na.ssl-images-amazon.com/images/I/51iPoFwQT3L._SL1230_.jpg\", \"https://images-na.ssl-images-amazon.com/images/I/61qbqFcvoNL._SL1500_.jpg\", \"https://images-na.ssl-images-amazon.com/images/I/51HCjA3rqYL._SL1230_.jpg\"]','<p>A good gaming console. Plays games of PS4! Enjoy if you can buy it mwahahahaha</p>','tech','Sony'),('xbox-series-s','Xbox Series S 512GB',0,'[\"https://images-na.ssl-images-amazon.com/images/I/71vPCX0bS-L._SL1500_.jpg\", \"https://images-na.ssl-images-amazon.com/images/I/71q7JTbRTpL._SL1500_.jpg\", \"https://images-na.ssl-images-amazon.com/images/I/71iQ4HGHtsL._SL1500_.jpg\", \"https://images-na.ssl-images-amazon.com/images/I/61IYrCrBzxL._SL1500_.jpg\", \"https://images-na.ssl-images-amazon.com/images/I/61RnXmpAmIL._SL1500_.jpg\"]',' <div> <ul> <li><span>Hardware-beschleunigtes Raytracing macht dein Spiel noch realistischer</span></li> <li><span>Spiele Games mit bis zu 120 Bilder pro Sekunde</span></li> <li><span>Minimiere Ladezeiten mit einer speziell entwickelten 512GB NVMe SSD und wechsle mit Quick Resume nahtlos zwischen mehreren Spielen.</span></li> <li><span>Xbox Smart Delivery stellt sicher, dass du die beste Version deines Spiels spielst, egal, auf welcher Konsole du spielst</span></li> <li><span>Spiele deine Xbox One-Spiele auf deiner Xbox Series S weiter. Deine Fortschritte, Erfolge und Freundesliste werden automatisch auf das neue System übertragen.</span></li> <li><span>Erwecke deine Spiele und Filme mit innovativem 3D Raumklang zum Leben</span></li> <li><span>Der brandneue Xbox Wireless Controller zeichnet sich durch höchste Präzision, eine neue Share-Taste und verbesserte Ergonomie aus</span></li> <li><span>Ultra-niedrige Latenz verbessert die Reaktionszeit von Controller zum Fernseher</span></li> <li><span>Verwende dein Xbox One-Gaming-Zubehör -einschließlich Controller, Headsets und mehr</span></li> <li><span>Erweitere deinen Speicher mit der Seagate 1 TB-Erweiterungskarte für Xbox Series X (separat erhältlich) und streame 4K-Videos von Disney+, Netflix, Amazon, Microsoft Movies &amp; TV und mehr</span></li> </ul> </div>','tech','Microsoft');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-18 16:17:41
