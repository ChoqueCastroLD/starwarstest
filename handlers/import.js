'use strict';

const { planetsSchema } = require("../models/planets.js");
const { getPlanet } = require("../services/swapi.js");
const { getDb } = require("../utils/database.js");

module.exports.import = async (event) => {
  try {
    const requestBody = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

    if (!requestBody.id) {
      throw new Error('ID is a required attribute');
    }

    const swapiPlanet = await getPlanet(requestBody.id);

    if (!swapiPlanet) {
      throw new Error('Planet not found');
    }

    const { db, connection } = await getDb();
    const [{ insertId }] = await db.insert(planetsSchema).values(swapiPlanet);
    await connection.end();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Data saved successfully, returning the ID',
        data: insertId
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error',
        error: JSON.stringify(error)
      })
    };
  }
};