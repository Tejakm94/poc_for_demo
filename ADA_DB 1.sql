-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: test
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `aircraftlist`
--

DROP TABLE IF EXISTS `aircraftlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aircraftlist` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `AircraftName` varchar(255) NOT NULL,
  `ProgrammeId` int DEFAULT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` int DEFAULT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aircraftlist`
--

LOCK TABLES `aircraftlist` WRITE;
/*!40000 ALTER TABLE `aircraftlist` DISABLE KEYS */;
INSERT INTO `aircraftlist` VALUES (1,'Airbus A320-200',1,'2026-09-15 14:47:25',1,1,'2026-09-15 14:47:25'),(2,'Airbus A321neo',1,'2026-09-15 14:47:25',1,1,'2026-09-15 14:47:25'),(3,'Airbus A350-900',1,'2026-09-15 14:47:25',1,1,'2026-09-15 14:47:25'),(4,'Boeing 737-800',2,'2026-09-15 14:47:25',1,1,'2026-09-15 14:47:25'),(5,'Boeing 737 MAX 8',2,'2026-09-15 14:47:25',1,1,'2026-09-15 14:47:25'),(6,'Boeing 777-300ER',2,'2026-09-15 14:47:25',1,1,'2026-09-15 14:47:25'),(7,'Boeing 787-9 Dreamliner',2,'2026-09-15 14:47:25',1,1,'2026-09-15 14:47:25'),(8,'ATR 72-600',3,'2026-09-15 14:47:25',1,1,'2026-09-15 14:47:25'),(9,'Embraer E190-E2',3,'2026-09-15 14:47:25',1,1,'2026-09-15 14:47:25'),(10,'Bombardier CRJ900',3,'2026-09-15 14:47:25',1,1,'2026-09-15 14:47:25');
/*!40000 ALTER TABLE `aircraftlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buslist`
--

DROP TABLE IF EXISTS `buslist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buslist` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `BusId` varchar(255) NOT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` int DEFAULT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `uq_bus_list_bus_id` (`BusId`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buslist`
--

LOCK TABLES `buslist` WRITE;
/*!40000 ALTER TABLE `buslist` DISABLE KEYS */;
INSERT INTO `buslist` VALUES (1,'BUS-001-A','2026-09-15 13:25:15',1,1,'2026-09-15 14:04:01'),(3,'BUS-001-v','2026-09-15 14:10:49',1,1,'2026-09-15 14:14:41'),(4,'BUS001','2026-09-15 14:33:21',1,1,'2026-09-15 14:33:21'),(5,'BUS002','2026-09-15 14:33:21',1,1,'2026-09-15 14:33:21'),(6,'BUS003','2026-09-15 14:33:21',1,1,'2026-09-15 14:33:21'),(7,'BUS004','2026-09-15 14:33:21',2,2,'2026-09-15 14:33:21'),(8,'BUS005','2026-09-15 14:33:21',2,2,'2026-09-15 14:33:21');
/*!40000 ALTER TABLE `buslist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `elementmaintenance`
--

DROP TABLE IF EXISTS `elementmaintenance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `elementmaintenance` (
  `Id` char(36) NOT NULL,
  `LRU_Name` varchar(255) DEFAULT NULL,
  `IcdVersionId` varchar(255) DEFAULT NULL,
  `AmndNo` varchar(255) DEFAULT NULL,
  `MessageName` varchar(255) DEFAULT NULL,
  `BlockId` varchar(255) DEFAULT NULL,
  `WordName` varchar(255) DEFAULT NULL,
  `WordId` varchar(255) DEFAULT NULL,
  `ElementName` varchar(255) DEFAULT NULL,
  `ElementNo` int DEFAULT NULL,
  `StartBitPosition` int DEFAULT NULL,
  `EndBitPosition` int DEFAULT NULL,
  `ElementApplicability` int DEFAULT NULL,
  `AliasName` varchar(255) DEFAULT NULL,
  `ElementLSB` varchar(255) DEFAULT NULL,
  `ElementMSB` varchar(255) DEFAULT NULL,
  `SignalTypeId` int DEFAULT NULL,
  `Units` varchar(255) DEFAULT NULL,
  `ElementRemarks` varchar(255) DEFAULT NULL,
  `MessageNo` int DEFAULT NULL,
  `SelectedProgrammesId` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` int DEFAULT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `RemoteTableId` char(36) DEFAULT NULL,
  `MessageTableId` char(36) DEFAULT NULL,
  `WordTableId` char(36) DEFAULT NULL,
  `SelectAircraftIds` varchar(255) DEFAULT NULL,
  `ApprovedAt` datetime DEFAULT NULL,
  `ApprovedBy` int DEFAULT NULL,
  `IsApproved` int NOT NULL DEFAULT '0',
  `AdminRemarks` varchar(255) DEFAULT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `SelectBitPosition` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `idx_element_word` (`WordTableId`),
  KEY `idx_element_message` (`MessageTableId`),
  KEY `idx_element_remote` (`RemoteTableId`),
  KEY `idx_element_signal` (`SignalTypeId`),
  CONSTRAINT `fk_element_message` FOREIGN KEY (`MessageTableId`) REFERENCES `messagemaintenance` (`Id`),
  CONSTRAINT `fk_element_remote` FOREIGN KEY (`RemoteTableId`) REFERENCES `remoteterminalmaintenance` (`Id`),
  CONSTRAINT `fk_element_signal` FOREIGN KEY (`SignalTypeId`) REFERENCES `signallist` (`Id`),
  CONSTRAINT `fk_element_word` FOREIGN KEY (`WordTableId`) REFERENCES `wordmaintenance` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `elementmaintenance`
--

LOCK TABLES `elementmaintenance` WRITE;
/*!40000 ALTER TABLE `elementmaintenance` DISABLE KEYS */;
/*!40000 ALTER TABLE `elementmaintenance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `frameslist`
--

DROP TABLE IF EXISTS `frameslist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `frameslist` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `FrameName` varchar(255) NOT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` int DEFAULT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `frameslist`
--

LOCK TABLES `frameslist` WRITE;
/*!40000 ALTER TABLE `frameslist` DISABLE KEYS */;
INSERT INTO `frameslist` VALUES (1,'Frame 1','2026-09-15 18:36:40',1,NULL,NULL),(2,'Frame 2','2026-09-15 18:36:40',1,NULL,NULL),(3,'Frame 3','2026-09-15 18:36:40',1,NULL,NULL),(4,'Frame 4','2026-09-15 18:36:40',1,NULL,NULL),(5,'Frame 5','2026-09-15 18:36:40',1,NULL,NULL),(6,'Frame 1','2026-09-15 18:36:44',1,NULL,NULL),(7,'Frame 2','2026-09-15 18:36:44',1,NULL,NULL),(8,'Frame 3','2026-09-15 18:36:44',1,NULL,NULL),(9,'Frame 4','2026-09-15 18:36:44',1,NULL,NULL),(10,'Frame 5','2026-09-15 18:36:44',1,NULL,NULL);
/*!40000 ALTER TABLE `frameslist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guidelines`
--

DROP TABLE IF EXISTS `guidelines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guidelines` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Guideline` varchar(255) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guidelines`
--

LOCK TABLES `guidelines` WRITE;
/*!40000 ALTER TABLE `guidelines` DISABLE KEYS */;
INSERT INTO `guidelines` VALUES (1,'All passengers must carry a valid identification document.'),(2,'Passengers should arrive at least 2 hours before departure.'),(3,'Baggage must comply with the permitted weight limits.'),(4,'Restricted items are not allowed inside checked or cabin baggage.'),(5,'Passengers must follow all safety instructions provided by the crew.'),(6,'Seat belts must be fastened during takeoff and landing.'),(7,'Electronic devices must be used according to crew instructions.'),(8,'Emergency exits must remain clear at all times.'),(9,'Passengers must report lost baggage to the appropriate service desk.'),(10,'Any suspicious activity should be reported immediately to airport staff.');
/*!40000 ALTER TABLE `guidelines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messagemaintenance`
--

DROP TABLE IF EXISTS `messagemaintenance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messagemaintenance` (
  `Id` char(36) NOT NULL,
  `LRU_Name` varchar(255) DEFAULT NULL,
  `IcdVersionId` varchar(255) DEFAULT NULL,
  `AmndNo` varchar(255) DEFAULT NULL,
  `MessageName` varchar(255) DEFAULT NULL,
  `MessageNo` int DEFAULT NULL,
  `MessageAliasName` varchar(255) DEFAULT NULL,
  `MessageTypeId` int DEFAULT NULL,
  `MuxIdxId` varchar(255) DEFAULT NULL,
  `MsgDescription` varchar(255) DEFAULT NULL,
  `BlockId` varchar(255) DEFAULT NULL,
  `BusId` int DEFAULT NULL,
  `Frequency` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Source` varchar(255) DEFAULT NULL,
  `Destination` varchar(255) DEFAULT NULL,
  `RtAddress` int DEFAULT NULL,
  `WordCount` int DEFAULT NULL,
  `RxSubAddress` int DEFAULT NULL,
  `TxSubAddress` int DEFAULT NULL,
  `CmdWord` varchar(255) DEFAULT NULL,
  `FramesId` int DEFAULT NULL,
  `MsgRemarks` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` int DEFAULT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `RemoteTableId` char(36) DEFAULT NULL,
  `Status` varchar(255) DEFAULT NULL,
  `AliasDescription` varchar(255) DEFAULT NULL,
  `ApprovedAt` datetime DEFAULT NULL,
  `ApprovedBy` int DEFAULT NULL,
  `IsApproved` int NOT NULL DEFAULT '0',
  `AdminRemarks` varchar(255) DEFAULT NULL,
  `MessageId` varchar(255) DEFAULT NULL,
  `MuxPos` int DEFAULT NULL,
  `MuxStartBit` int DEFAULT NULL,
  `MuxEndBit` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `idx_message_remote` (`RemoteTableId`),
  KEY `idx_message_bus` (`BusId`),
  KEY `idx_message_frame` (`FramesId`),
  CONSTRAINT `fk_message_bus` FOREIGN KEY (`BusId`) REFERENCES `buslist` (`Id`),
  CONSTRAINT `fk_message_frame` FOREIGN KEY (`FramesId`) REFERENCES `frameslist` (`Id`),
  CONSTRAINT `fk_message_remote` FOREIGN KEY (`RemoteTableId`) REFERENCES `remoteterminalmaintenance` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messagemaintenance`
--

LOCK TABLES `messagemaintenance` WRITE;
/*!40000 ALTER TABLE `messagemaintenance` DISABLE KEYS */;
INSERT INTO `messagemaintenance` VALUES ('MES01','LRU01','ICD-V1','AMD-01','NavigationData',1,'NAV_DATA',1,'MUX01','Navigation message data','BLOCK01',1,'50Hz','LRU01','LRU02',10,20,5,6,'CMD001',1,'Test message','2026-09-15 18:36:57',1,NULL,'2026-09-15 18:36:57','RTM01','Active','Navigation data alias',NULL,NULL,0,'Initial creation','MSG001',1,0,15);
/*!40000 ALTER TABLE `messagemaintenance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `remoteterminalmaintenance`
--

DROP TABLE IF EXISTS `remoteterminalmaintenance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `remoteterminalmaintenance` (
  `Id` char(36) NOT NULL,
  `LRU_Name` varchar(255) DEFAULT NULL,
  `Equipment` int DEFAULT NULL,
  `ManufactureId` int DEFAULT NULL,
  `BusId` varchar(255) DEFAULT NULL,
  `RtAddress` varchar(255) DEFAULT NULL,
  `IcdVersionId` varchar(255) DEFAULT NULL,
  `SwVersion` varchar(255) DEFAULT NULL,
  `ReleaseVersion` varchar(255) DEFAULT NULL,
  `AmndNo` varchar(255) DEFAULT NULL,
  `RtNote` varchar(255) DEFAULT NULL,
  `RtRemarks` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` int DEFAULT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `AircraftType` int DEFAULT NULL,
  `SelectAircraftIds` varchar(255) DEFAULT NULL,
  `GuidelineId` int DEFAULT NULL,
  `SelectedProgrammesId` varchar(255) DEFAULT NULL,
  `HardwareVersion` varchar(255) DEFAULT NULL,
  `AmndDate` datetime DEFAULT NULL,
  `ApprovedAt` datetime DEFAULT NULL,
  `ApprovedBy` int DEFAULT NULL,
  `IsApproved` int NOT NULL DEFAULT '0',
  `AdminRemarks` varchar(255) DEFAULT NULL,
  `FileName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `idx_remote_bus` (`BusId`),
  KEY `idx_remote_aircraft_type` (`AircraftType`),
  KEY `idx_remote_guideline` (`GuidelineId`),
  CONSTRAINT `fk_remote_aircraft_type` FOREIGN KEY (`AircraftType`) REFERENCES `rt_aircrafttypelist1` (`Id`),
  CONSTRAINT `fk_remote_bus` FOREIGN KEY (`BusId`) REFERENCES `buslist` (`BusId`),
  CONSTRAINT `fk_remote_guideline` FOREIGN KEY (`GuidelineId`) REFERENCES `guidelines` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `remoteterminalmaintenance`
--

LOCK TABLES `remoteterminalmaintenance` WRITE;
/*!40000 ALTER TABLE `remoteterminalmaintenance` DISABLE KEYS */;
INSERT INTO `remoteterminalmaintenance` VALUES ('RTM01','LRU-001 Updated',2,2,'BUS001','RT-ADDRESS-02','ICD-V2','SW-2.0','REL-2.0','AMD-002','Updated RT','Updated remarks','2026-09-15 15:13:36',1,1,'2026-09-15 18:13:33',1,'1,2,3',1,'1,2','HW-2.0','2026-09-15 00:00:00',NULL,NULL,0,'Updated record','rt_document_updated.pdf'),('RTM02','LRU-001',1,2,'BUS001','RT-ADDRESS-01','ICD-V1','SW-1.0','REL-1.0','AMD-001','Test RT','Test remarks','2026-09-15 18:29:59',1,NULL,NULL,1,'1,2,3',1,'1,2','HW-1.0','2026-09-15 00:00:00',NULL,NULL,0,'Initial creation','rt_document.pdf');
/*!40000 ALTER TABLE `remoteterminalmaintenance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rt_aircrafttypelist1`
--

DROP TABLE IF EXISTS `rt_aircrafttypelist1`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rt_aircrafttypelist1` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `AircraftType` varchar(255) NOT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` int DEFAULT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rt_aircrafttypelist1`
--

LOCK TABLES `rt_aircrafttypelist1` WRITE;
/*!40000 ALTER TABLE `rt_aircrafttypelist1` DISABLE KEYS */;
INSERT INTO `rt_aircrafttypelist1` VALUES (1,'Airbus A320','2026-09-15 14:34:44',1,1,'2026-09-15 14:34:44'),(2,'Airbus A321','2026-09-15 14:34:44',1,1,'2026-09-15 14:34:44'),(3,'Airbus A350','2026-09-15 14:34:44',1,1,'2026-09-15 14:34:44'),(4,'Boeing 737','2026-09-15 14:34:44',1,1,'2026-09-15 14:34:44'),(5,'Boeing 747','2026-09-15 14:34:44',1,1,'2026-09-15 14:34:44'),(6,'Boeing 777','2026-09-15 14:34:44',1,1,'2026-09-15 14:34:44'),(7,'Boeing 787','2026-09-15 14:34:44',1,1,'2026-09-15 14:34:44'),(8,'ATR 72','2026-09-15 14:34:44',1,1,'2026-09-15 14:34:44'),(9,'Embraer E190','2026-09-15 14:34:44',1,1,'2026-09-15 14:34:44'),(10,'Bombardier CRJ900','2026-09-15 14:34:44',1,1,'2026-09-15 14:34:44');
/*!40000 ALTER TABLE `rt_aircrafttypelist1` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `signallist`
--

DROP TABLE IF EXISTS `signallist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `signallist` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `SignalId` varchar(255) NOT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` int DEFAULT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `signallist`
--

LOCK TABLES `signallist` WRITE;
/*!40000 ALTER TABLE `signallist` DISABLE KEYS */;
/*!40000 ALTER TABLE `signallist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wordmaintenance`
--

DROP TABLE IF EXISTS `wordmaintenance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wordmaintenance` (
  `Id` char(36) NOT NULL,
  `LRU_Name` varchar(255) DEFAULT NULL,
  `IcdVersionId` varchar(255) DEFAULT NULL,
  `AmndNo` varchar(255) DEFAULT NULL,
  `MessageName` varchar(255) DEFAULT NULL,
  `BlockId` varchar(255) DEFAULT NULL,
  `WordName` varchar(255) DEFAULT NULL,
  `No_of_elements` int DEFAULT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `WordRemarks` varchar(255) DEFAULT NULL,
  `WordNo` int DEFAULT NULL,
  `WordId` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` int DEFAULT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `MessageNo` int DEFAULT NULL,
  `RemoteTableId` char(36) DEFAULT NULL,
  `MessageTableId` char(36) DEFAULT NULL,
  `WordCount` int DEFAULT NULL,
  `ApprovedAt` datetime DEFAULT NULL,
  `ApprovedBy` int DEFAULT NULL,
  `IsApproved` int NOT NULL DEFAULT '0',
  `AdminRemarks` varchar(255) DEFAULT NULL,
  `WordApplicability` int DEFAULT NULL,
  `WordAliasName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `idx_word_remote` (`RemoteTableId`),
  KEY `idx_word_message` (`MessageTableId`),
  KEY `idx_word_business_id` (`WordId`),
  CONSTRAINT `fk_word_message` FOREIGN KEY (`MessageTableId`) REFERENCES `messagemaintenance` (`Id`),
  CONSTRAINT `fk_word_remote` FOREIGN KEY (`RemoteTableId`) REFERENCES `remoteterminalmaintenance` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wordmaintenance`
--

LOCK TABLES `wordmaintenance` WRITE;
/*!40000 ALTER TABLE `wordmaintenance` DISABLE KEYS */;
/*!40000 ALTER TABLE `wordmaintenance` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-15 18:41:45
