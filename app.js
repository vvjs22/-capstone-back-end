const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
// const { Pool } = require('pg');
const { Client } = require("pg-promise");
const events = require("./controllers/eventControllers");
require("dotenv").config();
const eventControllers = require("./controllers/eventControllers");

// const pool = new Pool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PW,
//   database: process.env.DB_NAME,
//   ssl:true,
// });



app.use(cors());
app.use(express.json());
app.use ('/events', eventControllers);

app.get("/", (req, res) => {
  res.send("Welcome to the app");
});

module.exports = app;
