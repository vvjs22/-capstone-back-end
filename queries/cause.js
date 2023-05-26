const express = require("express");
const causes = express.Router();
const db = require("../happndb/dbConfig.js");
const helpers = require("../helperFunctions/helperFunction.js");

// Select all events
const getAllCauses = async () => {
    try {
      const allEvents = await db.any(`SELECT c.*,
        COUNT(e.id) AS event_count
        FROM "Cause" AS c 
        join "Event" AS e
        ON c.id=e.cause_id
        GROUP BY c.id,c.type
        ORDER BY c.id ASC;`);
      return allEvents;
    } catch (error) {
      return error;
    }
  };


module.exports = {getAllCauses};