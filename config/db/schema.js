const { pool } = require("./connect");

// This schema uses MySQL types. SQL Server's `uniqueidentifier` is represented
// by CHAR(36), allowing UUID values such as "550e8400-e29b-41d4-a716-446655440000".
const statements = [
  `CREATE TABLE IF NOT EXISTS BusList (
    Id INT NOT NULL AUTO_INCREMENT, BusId VARCHAR(255) NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, CreatedBy INT NULL,
    UpdatedBy INT NULL, UpdatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (Id), UNIQUE KEY uq_bus_list_bus_id (BusId)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS RT_AircraftTypeList1 (
    Id INT NOT NULL AUTO_INCREMENT, AircraftType VARCHAR(255) NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, CreatedBy INT NULL,
    UpdatedBy INT NULL, UpdatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (Id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS FramesList (
    Id INT NOT NULL AUTO_INCREMENT, FrameName VARCHAR(255) NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, CreatedBy INT NULL,
    UpdatedBy INT NULL, UpdatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (Id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS Guidelines (
    Id INT NOT NULL AUTO_INCREMENT, Guideline VARCHAR(255) NOT NULL,
    PRIMARY KEY (Id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS AircraftList (
    Id INT NOT NULL AUTO_INCREMENT, AircraftName VARCHAR(255) NOT NULL, ProgrammeId INT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, CreatedBy INT NULL,
    UpdatedBy INT NULL, UpdatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (Id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS SignalList (
    Id INT NOT NULL AUTO_INCREMENT, SignalId VARCHAR(255) NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, CreatedBy INT NULL,
    UpdatedBy INT NULL, UpdatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (Id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS RemoteTerminalMaintenance (
    Id CHAR(36) NOT NULL, LRU_Name VARCHAR(255), Equipment INT, ManufactureId INT, BusId VARCHAR(255),
    RtAddress VARCHAR(255), IcdVersionId VARCHAR(255), SwVersion VARCHAR(255), ReleaseVersion VARCHAR(255),
    AmndNo VARCHAR(255), RtNote VARCHAR(255), RtRemarks VARCHAR(255),
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, CreatedBy INT NULL, UpdatedBy INT NULL,
    UpdatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    AircraftType INT NULL, SelectAircraftIds VARCHAR(255), GuidelineId INT NULL, SelectedProgrammesId VARCHAR(255),
    HardwareVersion VARCHAR(255), AmndDate DATETIME NULL, ApprovedAt DATETIME NULL, ApprovedBy INT NULL,
    IsApproved INT NOT NULL DEFAULT 0, AdminRemarks VARCHAR(255), FileName VARCHAR(255),
    PRIMARY KEY (Id), KEY idx_remote_bus (BusId), KEY idx_remote_aircraft_type (AircraftType), KEY idx_remote_guideline (GuidelineId),
    CONSTRAINT fk_remote_bus FOREIGN KEY (BusId) REFERENCES BusList(BusId),
    CONSTRAINT fk_remote_aircraft_type FOREIGN KEY (AircraftType) REFERENCES RT_AircraftTypeList1(Id),
    CONSTRAINT fk_remote_guideline FOREIGN KEY (GuidelineId) REFERENCES Guidelines(Id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS MessageMaintenance (
    Id CHAR(36) NOT NULL, LRU_Name VARCHAR(255), IcdVersionId VARCHAR(255), AmndNo VARCHAR(255),
    MessageName VARCHAR(255), MessageNo INT, MessageAliasName VARCHAR(255), MessageTypeId INT, MuxIdxId VARCHAR(255),
    MsgDescription VARCHAR(255), BlockId VARCHAR(255), BusId INT NULL, Frequency NVARCHAR(255), Source VARCHAR(255),
    Destination VARCHAR(255), RtAddress INT, WordCount INT, RxSubAddress INT, TxSubAddress INT, CmdWord VARCHAR(255),
    FramesId INT NULL, MsgRemarks VARCHAR(255), CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, CreatedBy INT NULL,
    UpdatedBy INT NULL, UpdatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    RemoteTableId CHAR(36) NULL, Status VARCHAR(255), AliasDescription VARCHAR(255), ApprovedAt DATETIME NULL,
    ApprovedBy INT NULL, IsApproved INT NOT NULL DEFAULT 0, AdminRemarks VARCHAR(255), MessageId VARCHAR(255),
    MuxPos INT, MuxStartBit INT, MuxEndBit INT, PRIMARY KEY (Id), KEY idx_message_remote (RemoteTableId),
    KEY idx_message_bus (BusId), KEY idx_message_frame (FramesId),
    CONSTRAINT fk_message_remote FOREIGN KEY (RemoteTableId) REFERENCES RemoteTerminalMaintenance(Id),
    CONSTRAINT fk_message_bus FOREIGN KEY (BusId) REFERENCES BusList(Id),
    CONSTRAINT fk_message_frame FOREIGN KEY (FramesId) REFERENCES FramesList(Id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS WordMaintenance (
    Id CHAR(36) NOT NULL, LRU_Name VARCHAR(255), IcdVersionId VARCHAR(255), AmndNo VARCHAR(255),
    MessageName VARCHAR(255), BlockId VARCHAR(255), WordName VARCHAR(255), No_of_elements INT, Description VARCHAR(255),
    WordRemarks VARCHAR(255), WordNo INT, WordId VARCHAR(255), CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT NULL, UpdatedBy INT NULL, UpdatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    MessageNo INT, RemoteTableId CHAR(36) NULL, MessageTableId CHAR(36) NULL, WordCount INT, ApprovedAt DATETIME NULL,
    ApprovedBy INT NULL, IsApproved INT NOT NULL DEFAULT 0, AdminRemarks VARCHAR(255), WordApplicability INT,
    WordAliasName VARCHAR(255), PRIMARY KEY (Id), KEY idx_word_remote (RemoteTableId), KEY idx_word_message (MessageTableId),
    KEY idx_word_business_id (WordId), CONSTRAINT fk_word_remote FOREIGN KEY (RemoteTableId) REFERENCES RemoteTerminalMaintenance(Id),
    CONSTRAINT fk_word_message FOREIGN KEY (MessageTableId) REFERENCES MessageMaintenance(Id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS ElementMaintenance (
    Id CHAR(36) NOT NULL, LRU_Name VARCHAR(255), IcdVersionId VARCHAR(255), AmndNo VARCHAR(255), MessageName VARCHAR(255),
    BlockId VARCHAR(255), WordName VARCHAR(255), WordId VARCHAR(255), ElementName VARCHAR(255), ElementNo INT,
    StartBitPosition INT, EndBitPosition INT, ElementApplicability INT, AliasName VARCHAR(255), ElementLSB VARCHAR(255),
    ElementMSB VARCHAR(255), SignalTypeId INT NULL, Units VARCHAR(255), ElementRemarks VARCHAR(255), MessageNo INT,
    SelectedProgrammesId VARCHAR(255), CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, CreatedBy INT NULL,
    UpdatedBy INT NULL, UpdatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    RemoteTableId CHAR(36) NULL, MessageTableId CHAR(36) NULL, WordTableId CHAR(36) NULL, SelectAircraftIds VARCHAR(255),
    ApprovedAt DATETIME NULL, ApprovedBy INT NULL, IsApproved INT NOT NULL DEFAULT 0, AdminRemarks VARCHAR(255),
    Description VARCHAR(255), SelectBitPosition VARCHAR(255), PRIMARY KEY (Id), KEY idx_element_word (WordTableId),
    KEY idx_element_message (MessageTableId), KEY idx_element_remote (RemoteTableId), KEY idx_element_signal (SignalTypeId),
    CONSTRAINT fk_element_word FOREIGN KEY (WordTableId) REFERENCES WordMaintenance(Id),
    CONSTRAINT fk_element_message FOREIGN KEY (MessageTableId) REFERENCES MessageMaintenance(Id),
    CONSTRAINT fk_element_remote FOREIGN KEY (RemoteTableId) REFERENCES RemoteTerminalMaintenance(Id),
    CONSTRAINT fk_element_signal FOREIGN KEY (SignalTypeId) REFERENCES SignalList(Id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
];

async function createSchema() {
  for (const statement of statements) await pool.execute(statement);
}

module.exports = { createSchema };
