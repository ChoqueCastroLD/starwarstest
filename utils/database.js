'use strict';

require('dotenv').config();

const { drizzle } = require("drizzle-orm/mysql2");
const mysql = require("mysql2/promise");
const schema = require('../models/planets.js');

async function getDb() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  const db = drizzle(connection, { schema, mode: "default" });
  return { db, connection };
}

module.exports = { getDb };
