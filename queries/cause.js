const express = require("express");
const causes = express.Router();
const db = require("../happndb/dbConfig.js");
const helpers = require("../helperFunctions/helperFunction.js");

// Select all events
const getAllCauses = async () => {
    try {
      const allEvents = await db.any('SELECT * FROM "Cause" ORDER BY id ASC');
      return allEvents;
    } catch (error) {
      return error;
    }
  };


module.exports = {getAllCauses};