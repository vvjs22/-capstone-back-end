const cors = require("cors");
const axios = require("axios");
const db = require("../happndb/dbConfig.js");

// Retrieve addresses from database
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
// Geocode function
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
// Retrieve address components from response
    const addressComponents = response.data.results[0].address_components;
// Initialize variables
    let borough = null;
    let city = null;
    let state = null;
    let zip = null;

// Loop through address components to find borough, city, state, and zip
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
// Update addresses function
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

// updateAddresses(); // Call the updateAddresses function on save

// Database trigger function
// async function handle() {
//   try {
//     // Call the updateAddresses function whenever a new entry is made on  "Event"
//     await updateAddresses();
//   } catch (error) {
//     console.error(error);
//   }
// }

// Create the handle function in the PostgreSQL database
// (async () => {
//   try {
//     await db.any(`
//       CREATE OR REPLACE FUNCTION handle() RETURNS TRIGGER AS $$
//       BEGIN
//         PERFORM updateAddresses();
//         RETURN NEW;
//       END;
//       $$ LANGUAGE plpgsql;
//     `);
//   } catch (error) {
//     console.error(error);
//   }
// })();

// Create the trigger in the PostgreSQL database
// (async () => {
//   try {
//     await db.any(`
//       CREATE OR REPLACE TRIGGER event_insert_trigger
//       AFTER INSERT ON "Event"
//       FOR EACH ROW
//       EXECUTE FUNCTION handle()
//     `);
//   } catch (error) {
//     console.error(error);
//   }
// })();

module.exports = { getAddresses, geocode, updateAddresses };