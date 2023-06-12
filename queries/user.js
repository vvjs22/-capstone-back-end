const db = require("../happndb/dbConfig.js");
// const helpers = require("../helperFunctions/helperFunction.js");

// Select all users
const getAllUsers = async () => {
  try {
    const allUsers = await db.any('SELECT * FROM "User" ORDER BY id ASC');
    return allUsers;
  } catch (error) {
    return error;
  }
};

// Get Current User
const getCurrUser = async (id) => {
  try {
    const currUser = await db.one('SELECT * FROM "User" WHERE id = $1', id);
    return currUser;
  } catch (error) {
    return error;
  }
};

// Create User
const createUser = async (user) => {
  try {
    const { id, email, f_name, l_name, user_profile_link } = user;
    const userExists = await checkUserExists(email);
    console.log("userExists", userExists);
    if (userExists) {
      return await db.one('SELECT 1 FROM "User" WHERE email = $1', email);
    } else {
      const currUser = await db.one(
        'INSERT INTO "User" (id,email,f_name,l_name,user_profile_link) VALUES($1,$2,$3,$4,$5) RETURNING *',
        [id, email, f_name, l_name, user_profile_link]
      );
      return currUser;
    }
  } catch (error) {
    throw error;
  }
};

async function checkUserExists(email) {
  try {
    const query = 'SELECT EXISTS(SELECT 1 FROM "User" WHERE email = $1)';
    const exists = await db.one(query, [email], (row) => row.exists);
    return exists;
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw error;
  }
}

module.exports = { getAllUsers, getCurrUser, createUser };
