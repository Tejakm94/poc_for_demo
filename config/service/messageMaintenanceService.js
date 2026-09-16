const { pool } = require("../db/connect");

const createMessageMaintenanceService = async (data) => {
  try {
    const {
      LRU_Name,
      IcdVersionId,
      AmndNo,
      MessageName,
      MessageNo,
      MessageAliasName,
      MessageTypeId,
      MuxIdxId,
      MsgDescription,
      BlockId,
      BusId,
      Frequency,
      Source,
      Destination,
      RtAddress,
      WordCount,
      RxSubAddress,
      TxSubAddress,
      CmdWord,
      FramesId,
      MsgRemarks,
      CreatedBy,
      RemoteTableId,
      Status,
      AliasDescription,
      AdminRemarks,
      MessageId,
      MuxPos,
      MuxStartBit,
      MuxEndBit,
    } = data;

    // Required field validation
    if (
      !LRU_Name ||
      !IcdVersionId ||
      !AmndNo ||
      !MessageName ||
      !BlockId ||
      !BusId ||
      !FramesId ||
      !RemoteTableId ||
      !CreatedBy
    ) {
      return {
        status: 0,
        message: "Required fields are missing",
      };
    }

    // Check BusId
    const [bus] = await pool.execute(
      `SELECT Id
       FROM BusList
       WHERE Id = ?`,
      [BusId],
    );

    if (bus.length === 0) {
      return {
        status: 0,
        message: "Invalid BusId. Bus does not exist",
      };
    }

    // Check FramesId
    const [frame] = await pool.execute(
      `SELECT Id
       FROM FramesList
       WHERE Id = ?`,
      [FramesId],
    );

    if (frame.length === 0) {
      return {
        status: 0,
        message: "Invalid FramesId. Frame does not exist",
      };
    }

    // Check RemoteTableId
    const [remoteTerminal] = await pool.execute(
      `SELECT Id
       FROM RemoteTerminalMaintenance
       WHERE Id = ?`,
      [RemoteTableId],
    );

    if (remoteTerminal.length === 0) {
      return {
        status: 0,
        message: "Invalid RemoteTableId. Remote terminal does not exist",
      };
    }

    // Check duplicate natural key
    const [existingMessage] = await pool.execute(
      `SELECT Id
       FROM MessageMaintenance
       WHERE LRU_Name = ?
         AND IcdVersionId = ?
         AND AmndNo = ?
         AND MessageName = ?
         AND BlockId = ?`,
      [LRU_Name, IcdVersionId, AmndNo, MessageName, BlockId],
    );

    if (existingMessage.length > 0) {
      return {
        status: 0,
        message: "Message maintenance data already exists",
      };
    }

    // Generate MES01, MES02, MES03...
    const [lastRecord] = await pool.execute(
      `SELECT Id
       FROM MessageMaintenance
       WHERE Id LIKE 'MES%'
       ORDER BY CAST(SUBSTRING(Id, 4) AS UNSIGNED) DESC
       LIMIT 1`,
    );

    let nextNumber = 1;

    if (lastRecord.length > 0) {
      const lastNumber = parseInt(lastRecord[0].Id.replace("MES", ""), 10);

      nextNumber = lastNumber + 1;
    }

    const id = `MES${String(nextNumber).padStart(2, "0")}`;

    // Insert message
    await pool.execute(
      `INSERT INTO MessageMaintenance (
        Id,
        LRU_Name,
        IcdVersionId,
        AmndNo,
        MessageName,
        MessageNo,
        MessageAliasName,
        MessageTypeId,
        MuxIdxId,
        MsgDescription,
        BlockId,
        BusId,
        Frequency,
        Source,
        Destination,
        RtAddress,
        WordCount,
        RxSubAddress,
        TxSubAddress,
        CmdWord,
        FramesId,
        MsgRemarks,
        CreatedAt,
        CreatedBy,
        RemoteTableId,
        Status,
        AliasDescription,
        ApprovedBy,
        AdminRemarks,
        MessageId,
        MuxPos,
        MuxStartBit,
        MuxEndBit
      )
      VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, NOW(), ?, ?, ?, ?, NULL, ?, ?,
        ?, ?, ?
      )`,
      [
        id,
        LRU_Name,
        IcdVersionId,
        AmndNo,
        MessageName,
        MessageNo ?? null,
        MessageAliasName ?? null,
        MessageTypeId ?? null,
        MuxIdxId ?? null,
        MsgDescription ?? null,
        BlockId,
        BusId,
        Frequency ?? null,
        Source ?? null,
        Destination ?? null,
        RtAddress ?? null,
        WordCount ?? null,
        RxSubAddress ?? null,
        TxSubAddress ?? null,
        CmdWord ?? null,
        FramesId,
        MsgRemarks ?? null,
        CreatedBy,
        RemoteTableId,
        Status ?? null,
        AliasDescription ?? null,
        AdminRemarks ?? null,
        MessageId ?? null,
        MuxPos ?? null,
        MuxStartBit ?? null,
        MuxEndBit ?? null,
      ],
    );

    return {
      status: 1,
      message: "Message maintenance created successfully",
      data: {
        id,
        LRU_Name,
        IcdVersionId,
        AmndNo,
        MessageName,
        MessageNo,
        BlockId,
        BusId,
        FramesId,
        RemoteTableId,
      },
    };
  } catch (error) {
    console.log("createMessageMaintenanceService Error:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return {
        status: 0,
        message: "Message maintenance data already exists",
      };
    }

    return {
      status: 0,
      message: "Something went wrong while creating message maintenance",
    };
  }
};

const getAllMessageMaintenanceService = async () => {
  try {
    const [rows] = await pool.execute(
      `SELECT
        Id,
       LRU_Name,
        IcdVersionId,
        AmndNo,
        MessageName,
        MessageNo,
        MessageAliasName,
        MessageTypeId,
        MuxIdxId,
        MsgDescription,
        BlockId,
        BusId,
        Frequency,
        Source,
        Destination,
        RtAddress,
        WordCount,
        RxSubAddress,
        TxSubAddress,
        CmdWord,
        FramesId,
        MsgRemarks,
        CreatedAt,
        CreatedBy,
        RemoteTableId,
        Status,
        AliasDescription,
        ApprovedBy,
        AdminRemarks,
        MessageId,
        MuxPos,
        MuxStartBit,
        MuxEndBit
       FROM MessageMaintenance
       ORDER BY CreatedAt DESC`,
    );

    if (rows.length === 0) {
      return {
        status: 0,
        message: "No message maintenance records found",
        data: [],
      };
    }

    return {
      status: 1,
      message: "Message maintenance records fetched successfully",
      data: rows,
    };
  } catch (error) {
    console.log("getAllMessageMaintenanceService Error:", error);
  }
};

module.exports = {
  createMessageMaintenanceService,
  getAllMessageMaintenanceService,
};
