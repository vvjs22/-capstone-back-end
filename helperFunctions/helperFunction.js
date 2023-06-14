const cors = require("cors");
const axios = require("axios");
const db = require("../happndb/dbConfig.js");

async function getAddresses() {
  try {
    const addresses = await db.any(
      'SELECT id, address FROM "Event" WHERE location IS NULL OR latitude IS NULL OR longitude IS NULL OR city IS NULL OR state IS NULL OR zip IS NULL'
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

    const addressComponents = response.data.results[0].address_components;

    let borough = null;
    let city = null;
    let state = null;
    let zip = null;


    for (const component of addressComponents) {
      if (component.types.includes("administrative_area_level_2")) {
        borough = component.long_name;
      }
      if (component.types.includes("locality")) {
        city = component.long_name;
      }
      if (component.types.includes("administrative_area_level_1")) {
        state = component.short_name;
      }
      if (component.types.includes("postal_code")) {
        zip = component.long_name;
      }
    }

    // Use borough if available, otherwise just use city
    const finalCity = borough || city;

    return {
      location: `SRID=4326;POINT(${lng} ${lat})`,
      latitude: lat,
      longitude: lng,
      city: finalCity,
      state: state,
      zip: zip,
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
        const { location, latitude, longitude, city, state, zip } = geocodedData;
        await db.any(
          'UPDATE "Event" SET location = $1, latitude = $2, longitude = $3, city = $4, state = $5, zip = $6  WHERE id = $7',
          [location, latitude, longitude, city, state, zip, row.id]
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
}

updateAddresses(); // Call the updateAddresses function

module.exports = { getAddresses, geocode, updateAddresses };