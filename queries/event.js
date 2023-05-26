const express = require("express");
const events = express.Router();
const db = require("../happndb/dbConfig.js");
const helpers = require("../helperFunctions/helperFunction.js");

// Select all events
const getAllEvents = async () => {
  // Going to add user name and photo
  try {
    const allEvents = await db.any(`'SELECT 
    e.id,
    e.title,
    e.organizer_user_id,
    u.f_name 
    FROM "Event" AS e
    join "User" AS u
    ON e.organizer_user_id = u.id'`);
    return allEvents;
  } catch (error) {
    return error;
  }
};

const getCauseById = async (causeId) => {
  try {
    const causeType = await db.one('SELECT * FROM "Cause" WHERE id = $1', causeId);
    const count = await db.one('SELECT COUNT(*) FROM "Event" WHERE cause_id = $1', causeId);
    const causeList = await db.any(
      'SELECT ' +
      '  title, description, organizer_user_id, checked_in_users, address, city, state ' +
      'FROM "Event" ' +
      'WHERE cause_id = $1',
      causeId
    );

    // Get the organizer_user_id First, Last and Profile Pic for each event card
    const organizerIds = causeList.map(event => event.organizer_user_id);
    const organizerNameProfilePic = await db.any(
      'SELECT id, f_name, l_name, user_profile_link FROM "User" WHERE id = ANY($1)',
      [organizerIds]
    );

  const causeListWithCount = causeList.map(event => ({
  ...event,
  // checked_in_users_count: event.checked_in_users ? db.one('SELECT array_length($1, 1) FROM "Event"', [event.checked_in_users]) || 0 : 0,
  organizer: organizerNameProfilePic.find(organizer => organizer.id === event.organizer_user_id)
}));


    return { causeType, count, causeList: causeListWithCount };
  } catch (error) {
    return error;
  }
};


// Get one event
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

// Create a new event
const createEvent = async (event) => {
  try {
    const newEvent = await db.one(
      'INSERT INTO "Event" (title, description, date, time, address, city, state, zip, img_link, organizer_user_id, checked_in_users, cause_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
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
        event.cause_id,
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

// Allow user to check-in to event
const userCheckIn = async (eventID, userID) => {
  try {
    await db.none(
      'UPDATE "Event_attendee" SET user_id = array_append(user_id, $1) WHERE event_id = $2',
      [userID, eventID]
    );
    return 'Check-in successful';
  } catch (error) {
    return error;
  }
};

module.exports = { getAllEvents, getEvent, createEvent, getCauseById, userCheckIn };
