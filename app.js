const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const { Pool } = require('pg');
const { Client } = require("pg-promise");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
  ssl:true,
});

async function getAddresses() {
  try {
    const addresses = await pool.query('SELECT id, address FROM "Event" WHERE location IS NULL');
    return addresses; // Return the addresses from the function
  } catch (err) {
    console.error(err.message);
  }
}

async function geocode(address) {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        components: 'country:US|administrative_area:NY|locality:New York',
        key: process.env.GOOGLE_API_KEY,
      }
    });

    const { lat, lng } = response.data.results[0].geometry.location;

    return `SRID=4326;POINT(${lng} ${lat})`;
  } catch (err) {
    console.error(err.message);
  }
}

async function updateAddresses() {
  try {
    const addresses = await getAddresses(); // Retrieve addresses
    for (let row of addresses.rows) {
      const POINT = await geocode(row.address); // Use geocode function
      await pool.query('UPDATE "Event" SET location = $1 WHERE id = $2', [POINT, row.id]);
    }
  } catch (error) {
    console.error(error);
  }
}

updateAddresses(); // Call the updateAddresses function


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the app");
});

module.exports = app;
