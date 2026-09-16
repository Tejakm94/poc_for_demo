const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../../middleware/async");
const {
  addBusListService,
} = require("../../service/busListServies");
  
exports.addBusList = asyncWrapper(async (req, res) => {
//   logger.info(configurations.logger.checkPartListLogger);
  const {
    busId,
    createdBy,
  } = req.body;
  const result = await addBusListService(
    busId,
    createdBy,
  );
  res.status(StatusCodes.OK).json(result);
});

 


