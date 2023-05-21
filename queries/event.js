const express = require("express");
const events = express.Router();
const db = require("../happndb/dbConfig.js");
const helpers = require("../helperFunctions/helperFunction.js");

const getAllEvents = async () => {
  try {
    const allEvents = await db.any('SELECT * FROM "Event" ORDER BY id ASC');
    return allEvents;
  } catch (error) {
    return error;
  }
};

// // Category selection for map
// const categorySelect = async (category) => {
//   try {
//     const categoryGroup = await db.any(
//       'SELECT User.f_name, User.l_name, User.user_profile_link, Event.title, Event.description, Event.date, Event.time, Event.category, Event.img_link, Event.checked_in_users, Event.latitude, Event.longitude FROM "Event" JOIN User ON Event.organizer_user_id = User.id WHERE category = $1 ',
//       category
//     );
//     return categoryGroup;
//   } catch (error) {
//     return error;
//   }
// };
const getCauseById = async (id) => {
  try {
    const cause = await db.one('SELECT * FROM "Cause" WHERE id = $1', id);
    return cause;
  } catch (error) {
    return error;
  }
};


const getEvent = async (id) => {
  try {
    const eventId = parseInt(id); // Id is a integer
    const oneEvent = await db.one(
      'SELECT * FROM "Event" WHERE id = $1',
      eventId
    );
    return oneEvent;
  } catch (error) {
    return error;
  }
};

const createEvent = async (event) => {
  try {
    const newEvent = await db.one(
      'INSERT INTO "Event" (title, description, date, time, address, city, state, zip, img_link, organizer_user_id, checked_in_users) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [
        event.name,
        event.title,
        event.description,
        event.date,
        event.time,
        event.address,
        event.city,
        event.state,
        event.zip,
        event.img_link,
        event.organizer_user_id,
        event.checked_in_users,
      ]
    );
    //helper function w/ google api to get 4326, lat and long from address
    const geoCoordinates = await helperFunction.geocode(newEvent.address);
    newEvent.location = geoCoordinates.location;
    newEvent.latitude = geoCoordinates.latitude;
    newEvent.longitude = geoCoordinates.longitude;

    // Update the row in the database with the geoCoordinates
    await db.none(
      'UPDATE "Event" SET location = $1, latitude = $2, longitude = $3 WHERE id = $4',
      [
        geoCoordinates.location,
        geoCoordinates.latitude,
        geoCoordinates.longitude,
        newEvent.id,
      ]
    );

    return newEvent;
  } catch (error) {
    return error;
  }
};

module.exports = { getAllEvents, getEvent, createEvent, getCauseById };
