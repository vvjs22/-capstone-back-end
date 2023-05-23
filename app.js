const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const { Client } = require("pg-promise");

const events = require("./controllers/eventControllers");
const users = require("./controllers/userControllers");
const causes = require("./controllers/causeControllers");

require("dotenv").config();

const eventControllers = require("./controllers/eventControllers");
const userControllers = require("./controllers/userControllers");
const causeControllers = require("./controllers/causeControllers");

app.use(cors());
app.use(express.json());
app.use("/events", eventControllers);
app.use("/users", userControllers);
app.use("/causes", causeControllers);

app.get("/", (req, res) => {
  res.send("Welcome to the app");
});

module.exports = app;
