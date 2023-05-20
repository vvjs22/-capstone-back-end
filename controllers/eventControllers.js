const express = require("express");
const events = express.Router();
const db = require("../happndb/dbConfig.js");
const helpers = require("../helperFunctions/helperFunction.js");
const { Client } = require("pg-promise");
const { getAllEvents, getEvent, createEvent } = require("../queries/event.js");

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
events.get("/category/:category", async (req, res) => {
  try {
    const { id } = req.params;
    const categoryGroup = await categorySelect(category);
    res.json(categoryGroup);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Category does not exist" });
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
    });
    res.json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = events;
