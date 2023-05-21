const express = require("express");
const users = express.Router();
const db = require("../happndb/dbConfig.js");
const { Client } = require("pg-promise");
const { getAllUsers, getCurrUser, createEvent } = require("../queries/user.js");

//INDEX
users.get("/", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No Users found" });
  }
});

users.get("/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extract id from req.params fixed -js
    const oneUser = await getCurrUser(id); // Pass id as an argument fixed -js
    res.json(oneUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});


// //Specific categories for map display
// events.get("/category/:category", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const categoryGroup = await categorySelect(category);
//     res.json(categoryGroup);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Category does not exist" });
//   }
// });

// //CREATE
// events.post("/", async (req, res) => {
//   try {
//     const {
//       name,
//       title,
//       description,
//       date,
//       time,
//       address,
//       city,
//       state,
//       zip,
//       img_link,
//       organizer_user_id,
//       checked_in_users,
//     } = req.body;
//     const newEvent = await createEvent({
//       name,
//       title,
//       description,
//       date,
//       time,
//       address,
//       city,
//       state,
//       zip,
//       img_link,
//       organizer_user_id,
//       checked_in_users,
//     });
//     res.json(newEvent);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "An error occurred" });
//   }
// });

module.exports = users;
