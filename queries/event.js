const express = require("express");
const events = express.Router();
const db = require("../happndb/dbConfig.js");
// const { Pool } = require('pg');
// const pool = new Pool({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     user: process.env.DB_USER,
//     password: process.env.DB_PW,
//     database: process.env.DB_NAME,
//     ssl:true,
//   });
// const { Client } = require("pg-promise");
const helpers = require("../helperFunctions/helperFunction.js");

const getAllEvents = async () => {
    try {
      const allEvents = await db.any('SELECT * FROM "Event"');
      return allEvents;
    } catch (error) {
      return error;
    }
  };
  
  const getEvent = async (id) => {
    try {
      const oneEvent = await db.one('SELECT * FROM "Event" WHERE id=$1', id);
      return oneEvent;
    } catch (error) {
      return error;
    }
  };
  
  const createEvent = async (event) => {
    try {
      const newEvent = await db.one(
        'INSERT INTO "Event" (title, description, date, time, address, city, state, zip, img_link, organizer_user_id, checked_in_users) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
        [event.name, event.title, event.description, event.date, event.time, event.address, event.city, event.state, event.zip, event.img_link, event.organizer_user_id, event.checked_in_users]
      );
    //helper function to get 4326, lat and long from address
    const geoCoordinates = await helperFunction.geocode(newEvent.address);
    newEvent.location = geoCoordinates.location;
    newEvent.latitude = geoCoordinates.latitude;
    newEvent.longitude = geoCoordinates.longitude;

      return newEvent;
    } catch (error) {
      return error;
    }
  };
  
  module.exports = { getAllEvents, getEvent, createEvent };