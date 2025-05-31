-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: mainline.proxy.rlwy.net    Database: veterinaria
-- ------------------------------------------------------
-- Server version	9.3.0

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
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `edad` int DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Kakas',23,'$2b$10$XsdcbZMvNOJiLoEqL.IbyuJsqgfOKIK9jhuK4c.HGmCjgScpxnT0e','2025-05-27 00:13:04'),(2,'Fede',30,'$2b$10$sLS2MPELNPoHv2ATRUbJV..UImNII1Hroa3DECw.5CL43OjOySJea','2025-05-27 00:23:03'),(3,'Juanjok',43,'$2b$10$hIrg8nheCj/nJ28kwjgY6euwvlX5Y42vzwX5AMYhPhhEr2i92BhIS','2025-05-27 00:36:10'),(4,'Andres ',20,'$2b$10$8JP0Jom7UPeBQfwdRXI2e.0NRgO4JqR1piOPLmGyafpNtqwhxhu4C','2025-05-27 00:52:43'),(5,'Andres Felipe',20,'$2b$10$mUDPcx/7Yau7f2c2Wrf9zOWSeaPXc1AxXO0tW6LlOZXaEQJMclJRS','2025-05-27 00:53:37'),(7,'Kawasaki',29,'$2b$10$t8FHygmIvMjnq04bl94VYOb7MI7fVC95auBIyfxYpUS3wmQTevctS','2025-05-30 16:07:32'),(8,'usuarioTest',30,'$2b$10$QGIR.Au5Zq4xGILsGqFRoe9ZXbQyOkaXJGgeN8IjA6qnCLxlTEV12','2025-05-30 16:08:53'),(9,'usuarioTest',30,'$2b$10$LLRb3aVeBTj1Uzhe4GJDoezRvL7FuUHUU524PZ39Vnru2.jKRbnFG','2025-05-30 16:16:51'),(10,'usuarioTest',30,'$2b$10$UXJssZyIgdfILmnsVf.4wuoTZA.rGqdYRB3/YamNvUohYsQmyzhti','2025-05-30 16:17:36'),(11,'usuarioTest',30,'$2b$10$oiZkpw2XtXbWL5qqhkkOPONmNhYmU5918.kv4UTFvCLIyLjc/gMBK','2025-05-30 16:20:06'),(12,'Pito',5,'$2b$10$nA.VMNkb4Pfz7dtFWXJ9J.vCiN0s25tsmM91FHpmQAKXwjN0AbHvi','2025-05-31 01:34:58');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-30 23:53:04
