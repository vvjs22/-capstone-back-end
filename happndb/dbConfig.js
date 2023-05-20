//File required for local and hosted apps
//This file is used to connect to the database

const pgp = require('pg-promise')();
require('dotenv').config();

const { DATABASE_URL, PG_HOST, PG_PORT, PG_DATABASE, PG_USER } = process.env;
const cn = DATABASE_URL
  ? {
      connectionString: DATABASE_URL,
      ssl:true,
      max: 30,
    }
  : {
      host: PG_HOST,
      port: PG_PORT,
      database: PG_DATABASE,
      user: PG_USER,
    };

// alt from express docs
// var db = pgp('postgres://username:password@host:port/database')

//const { Pool } = require('pg');
// const pool = new Pool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PW,
//   database: process.env.DB_NAME,
//   ssl:true,
// });

const db = pgp(cn);
console.log("PostgreSQL connected!", cn);
module.exports = db;