const express = require("express");
const events = express.Router();
const db = require("../happndb/dbConfig.js");
const helpers = require("../helperFunctions/helperFunction.js");
const { Client } = require("pg-promise");
const {
  getAllEvents,
  getEvent,
  createEvent,
  deleteEvent,
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

//SHOW
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
      cause_id,
      category,
      location,
      latitude,
      longitude,
    } = req.body;
    const newEvent = await createEvent({
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
      cause_id,
      category,
      location,
      latitude,
      longitude,
    });
    res.json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

//DELETE
events.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await deleteEvent(id);
    res.json(deletedEvent);
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
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = events;
