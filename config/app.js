//Requiring the necessary packages

const express = require("express");
const app = express();
const helmet = require("helmet");
const bodyParser = require("body-parser");

const { configurations } = require("./config/config");

//Cross-connection middleware

const cors = require("cors");
const corsOptions = {
  origin: "*", // Replace with your own domain
};

app.use(cors(corsOptions));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [
          "'self'",

          "http://192.168.13.95:5001",

          "http://localhost:5001",
        ],

        styleSrc: [
          "'self'",

          "'unsafe-inline'",

          "http://192.168.13.95:5001",

          "http://localhost:5001",
        ],

        scriptSrc: [
          "'self'",

          "'unsafe-inline'",

          "http://192.168.13.95:5001",

          "http://localhost:5001",
        ],

        // reportUri: '/report-violation',

        // objectSrc: ["'self'"]
      },
    },

    referrerPolicy: { policy: "same-origin" },
  }),
);

//to parse request parameters

const payloadLimit = 500 * 1024 * 1024;

app.use(bodyParser.json({ limit: payloadLimit })); // Adjust the limit as needed

app.use(bodyParser.urlencoded({ limit: payloadLimit, extended: true }));

const api = express.Router();

/****************************************************************/

//Importing modules

/***************************LOGIN  & SIGNUP MODULE API*********************/

const { addBusList } = require("./controller/busList/addBusList");
const { updateBusList } = require("./controller/busList/updateBusList");
const { getAllBusList } = require("./controller/busList/getAllBusList");

const {
  createRemoteTerminalMaintenance,
} = require("./controller/remoteTerminalMaintenance/createRemoteTerminalMaintenance");
const {
  updateRemoteTerminalMaintenance,
} = require("./controller/remoteTerminalMaintenance/updateRemoteTerminalMaintenance");
const {
  getAllRemoteTerminalMaintenance,
} = require("./controller/remoteTerminalMaintenance/getAllRemoteTerminalMaintenance");

const {
  createMessageMaintenance,
} = require("./controller/messageMaintenance/createMessageMaintenance ");
const {
  getAllMessageMaintenance,
} = require("./controller/messageMaintenance/getAllMessageMaintenance");

app.post("/addBusList", addBusList);
app.patch("/updateBusList", updateBusList);
app.get("/getAllBusList", getAllBusList);
app.post("/createRemoteTerminalMaintenance", createRemoteTerminalMaintenance);
app.patch("/updateRemoteTerminalMaintenance", updateRemoteTerminalMaintenance);
app.get("/getAllRemoteTerminalMaintenance", getAllRemoteTerminalMaintenance);
app.post("/createMessageMaintenance", createMessageMaintenance);
app.get("/getAllMessageMaintenance", getAllMessageMaintenance);

module.exports = app;
