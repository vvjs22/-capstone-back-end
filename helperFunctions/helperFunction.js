const cors = require("cors");
const axios = require("axios");
const db = require("../happndb/dbConfig.js");

async function getAddresses() {
  try {
    const addresses = await db.any(
      'SELECT id, address FROM "Event" WHERE location IS NULL'
    );
    return addresses; // Return the addresses from the function
  } catch (err) {
    console.error(err.message);
  }
}

async function geocode(address) {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: address,
          components: "country:US|administrative_area:NY|locality:New York",
          key: process.env.GOOGLE_API_KEY,
        },
      }
    );

    const { lat, lng } = response.data.results[0].geometry.location;

    return {
      location: `SRID=4326;POINT(${lng} ${lat})`,
      latitude: lat,
      longitude: lng,
    };
  } catch (err) {
    console.error(err.message);
  }
}

async function updateAddresses() {
  try {
    const addresses = await getAddresses(); // Retrieve addresses
    for (let row of addresses) {
      const geocodedData = await geocode(row.address); // Use geocode function
      if (geocodedData) {
        const { location, latitude, longitude } = geocodedData;
        await db.any(
          'UPDATE "Event" SET location = $1, latitude = $2, longitude = $3 WHERE id = $4',
          [location, latitude, longitude, row.id]
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
}

// updateAddresses(); // Call the updateAddresses function

module.exports = { getAddresses, geocode, updateAddresses };
