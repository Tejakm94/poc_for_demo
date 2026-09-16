const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../../middleware/async");
const {
  getAllBusListService,
} = require("../../service/busListServies");
  
exports.getAllBusList = asyncWrapper(async (req, res) => {
//   logger.info(configurations.logger.checkPartListLogger);
  
  const result = await getAllBusListService(
  );
  res.status(StatusCodes.OK).json(result);
});

 


