//Requiring the necessary packages
require("dotenv").config(); //comment it in production enviroment
 
exports.configurations = {
 
  //Email details
  Email: {},
 
  //Application host and port
  AltenApplication: {
    host: "0.0.0.0",
    port: 5000,
  },
 
  //Error Log
  errorLogId: "file",
 
  //Jsonwebtokens
  jwtSecret: process.env.JWT_SECRET,
  jwtLifetime: "1d",
  userSession: [],
  urlMap: {},
  sessionTimeout: 3600000, //session timeout time  1 hour
 
  socketIoClientURL: "http://<server-ip/domain-name>:<Production-PORT>",
  //Database details
  dbPoolSize: 100,
  Database: {
    // development and testing pupose
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    host: process.env.DB_HOST || "localhost",
    databaseName: process.env.DB_NAME || "test",
 
    dialect: "mysql",
  },
 
 
  //user path access details
  PublicRoutes: [
    "/login",
    "/logout",
    "/getAllAccessLevel",
    "/getAllAccessType",
    "/switchServers",
    "/decodeTinyUrl",
  ],
 
  // timeout maximum sockets
  timeOut: 120000,
  maxSockets: 1000000,
 
 Messages: {
    common: {
      provideDetails: `Please provide proper details`,
      noDataAvailableForCompare: `No modules created from selected Reference BOM`,
      noData: "No data available",
      error: "An error occurred.Please try again later",
      databaseRrror: "Couldn't connect to database.Please try again later",
      invalidModuleId: `invalid moduleId`,
      compareProvideDetails: `Please select reference for comparing`,
      updateModuleStatus: `Status change is not allowed. Please Raise Status Change request.`,
    },
}
// logger: {
// }
};
