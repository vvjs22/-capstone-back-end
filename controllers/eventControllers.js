const express = require("express");
const events = express.Router();
const db = require("../happndb/dbConfig.js");
const helpers = require("../helperFunctions/helperFunction.js");
const { Client } = require("pg-promise");
const { getAllEvents, getEvent, createEvent, getCauseById, userCheckIn } = require("../queries/event.js");

//INDEX
events.get("/", async (req, res) => {
  try {
    const events = await getAllEvents();
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

//SHOW remove queries from here
events.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const oneEvent = await getEvent(id);
    res.json(oneEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

//Specific categories for map display
events.get('/cause/:causeId', async (req, res) => {
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

//CREATE
events.post("/", async (req, res) => {
  try {
    const {
      name,
      title,
      description,
      date,
      time,
      address,
      city,
      state,
      zip,
      img_link,
      organizer_user_id,
      checked_in_users,
      cause_id,
    } = req.body;
    const newEvent = await createEvent({
      name,
      title,
      description,
      date,
      time,
      address,
      city,
      state,
      zip,
      img_link,
      organizer_user_id,
      checked_in_users,
      cause_id,
    });
    res.json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

//CHECK-IN
events.post('/checkin', async (req, res) => {
  try {
    const { eventID, userID } = req.body;

    // Call the checkIn function to add the user to the attendee list
    const result = await userCheckIn(eventID, userID);

    res.json({ message: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


module.exports = events;
