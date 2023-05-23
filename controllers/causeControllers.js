const express = require("express");
const causes = express.Router();
const db = require("../happndb/dbConfig.js");
const helpers = require("../helperFunctions/helperFunction.js");
const { Client } = require("pg-promise");
const {  getAllCauses } = require("../queries/cause.js");
const { getCauseById} = require("../queries/event.js");


//INDEX
causes.get("/", async (req, res) => {
    try {
      const events = await getAllCauses();
      res.json(events);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  });

  //Cause Type by ID, Event Card/ Cause List
causes.get('/:causeId', async (req, res) => {
    try {
      const { causeId } = req.params;
  
      // Call the getCauseById function to get the count of events
      const causeFunction = await getCauseById(causeId);
  
      // Send the count as the response
      res.json(causeFunction );
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  module.exports = causes;
