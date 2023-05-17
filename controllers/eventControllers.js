const express = require("express");
const events = express.Router();
const { Pool } = require('pg');
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    ssl:true,
  });
const { Client } = require("pg-promise");
const {
    getAllEvents,
    getEvent,
    createEvent,
  } = require("../queries/event.js");


//INDEX
events.get("/", async (req, res) => {
    try {
      const events =  await getAllEvents();
      res.json(events);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });


  //SHOW remove queries from here 
    events.get('/:id', async (req, res) => {
    try {
      const { id } = req.params.id;
      const eventsQuery = 'SELECT * FROM "Event" WHERE id = $1';
      const { rows } = await pool.query(eventsQuery, [id]);
      const eventsArray = rows;
      res.json(eventsArray);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
    });

    //CREATE
    events.post('/', async (req, res) => {
        try {
            const { name, title, description, date, time, address, city, state, zip, img_link, organizer_user_id, checked_in_users } = req.body;
            const newEvent = await createEvent({ name, title, description, date, time, address, city, state, zip, img_link, organizer_user_id, checked_in_users });
            res.json(newEvent);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred' });
        }
    });

    module.exports = events;