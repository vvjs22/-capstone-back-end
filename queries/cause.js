const express = require("express");
const causes = express.Router();
const db = require("../happndb/dbConfig.js");
const helpers = require("../helperFunctions/helperFunction.js");

// Select all events
const getAllCauses = async () => {
    try {
      const allCauses = await db.any(`SELECT c.*,
        COUNT(e.id) AS event_count
        FROM "Cause" AS c 
        join "Event" AS e
        ON c.id=e.cause_id
        GROUP BY c.id,c.type
        ORDER BY c.id ASC;`);

          // Retrieve all events
    const allEvents = await db.any(`SELECT 
    e.*,
    u.f_name,
    u.l_name,
    u.user_profile_link 
FROM "Event" AS e
JOIN "User" AS u
    ON e.organizer_user_id = u.id;`);

        // Combine causes and events data
        const allData = allCauses.map(cause => {
          const causeList = allEvents.filter(event => event.cause_id === cause.id);
          return {
            ...cause,
            causeList
          };
        });
    

      return allData;
    } catch (error) {
      return error;
    }
  };


module.exports = {getAllCauses};