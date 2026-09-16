const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../../middleware/async");
const {
  createMessageMaintenanceService,
} = require("../../service/messageMaintenanceService");
// const { configurations } = require("../../config/config");
const { logger } = require("../../logs/logger");
 


exports.createMessageMaintenance = asyncWrapper(
  async (req, res) => {

    const result =
      await createMessageMaintenanceService(req.body);

    res.status(StatusCodes.OK).json(result);
  }
);
// exports.createMessageMaintenance  = asyncWrapper(async (req, res) => {
//   // logger.info(
//   //   configurations.logger.createRemoteTerminalMaintenanceLogger
//   // );

//   const {
//     LRU_Name,
//       IcdVersionId,
//       AmndNo,
//       MessageName,
//       MessageNo,
//       MessageAliasName,
//       MessageTypeId,
//       MuxIdxId,
//       MsgDescription,
//       BlockId,
//       BusId,
//       Frequency,
//       Source,
//       Destination,
//       RtAddress,
//       WordCount,
//       RxSubAddress,
//       TxSubAddress,
//       CmdWord,
//       FramesId,
//       MsgRemarks,
//       CreatedBy,
//       RemoteTableId,
//       Status,
//       AliasDescription,
//       approvedBy,
//       AdminRemarks,
//       MessageId,
//       MuxPos,
//       MuxStartBit,
//       MuxEndBit,
//   } = req.body;

//   const result = await createMessageMaintenanceService(
//     LRU_Name,
//       IcdVersionId,
//       AmndNo,
//       MessageName,
//       MessageNo,
//       MessageAliasName,
//       MessageTypeId,
//       MuxIdxId,
//       MsgDescription,
//       BlockId,
//       BusId,
//       Frequency,
//       Source,
//       Destination,
//       RtAddress,
//       WordCount,
//       RxSubAddress,
//       TxSubAddress,
//       CmdWord,
//       FramesId,
//       MsgRemarks,
//       CreatedBy,
//       RemoteTableId,
//       Status,
//       AliasDescription,
//       approvedBy,
//       AdminRemarks,
//       MessageId,
//       MuxPos,
//       MuxStartBit,
//       MuxEndBit,
//   );

//   res.status(StatusCodes.OK).json(result);
// });
