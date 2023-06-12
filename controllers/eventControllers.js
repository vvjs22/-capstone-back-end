const express = require("express");
const events = express.Router();
const db = require("../happndb/dbConfig.js");
const helpers = require("../helperFunctions/helperFunction.js");
const { Client } = require("pg-promise");
const {
  getAllEvents,
  getEvent,
  createEvent,
  getCauseById,
  userCheckIn,
} = require("../queries/event.js");

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

//CREATE
events.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const {
      cause_id,
      title,
      description,
      date,
      time,
      address,
      latitude,
      longitude,
      img_link,
      organizer_user_id,
      category,
      // checked_in_users,
    } = req.body;
    const newEvent = await createEvent({
      cause_id,
      title,
      description,
      date,
      time,
      address,
      img_link,
      latitude,
      longitude,
      organizer_user_id,
      category,
      // checked_in_users,
    });
    res.json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

//CHECK-IN
events.get("/:eventId/checkin/:userId", async (req, res) => {
  try {
    const { eventId, userId } = req.params;
    // Call the checkIn function to add the user to the attendee list
    const result = await userCheckIn(eventId, userId);

    res.json({ event: result });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = events;
