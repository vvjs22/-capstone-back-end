const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();

const eventControllers = require("./controllers/eventControllers");
const userControllers = require("./controllers/userControllers");
const causeControllers = require("./controllers/causeControllers");
const liveControllers = require("./controllers/liveControllers");

app.use(cors());
app.use(express.json());
app.use("/events", eventControllers);
app.use("/users", userControllers);
app.use("/causes", causeControllers);
app.use("/live", liveControllers);

app.get("/", (req, res) => {
  res.send("Welcome to the app");
});

module.exports = app;
