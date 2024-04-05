'use strict';

const { planetsSchema } = require("../models/planets");
const { getDb } = require("../utils/database");
const { validateObject } = require("../utils/validate");

module.exports.create = async (event) => {
  try {
    const requestBody = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

    const validationSchema = {
      nombre: { type: 'string', minLength: 1, maxLength: 512 },
      periodo_rotacion: { type: 'number', min: 0, max: 1000000 },
      periodo_orbital: { type: 'number', min: 0, max: 1000000 },
      diametro: { type: 'number', min: 0 },
      clima: { type: 'string' },
      gravedad: { type: 'string' },
      terreno: { type: 'string' },
      agua_superficial: { type: 'string' },
      poblacion: { type: 'number', min: 0 }
    };

    validateObject(requestBody, validationSchema); // will throw an error if invalid

    const { db, connection } = await getDb();
    const planet = await db.insert(planetsSchema).values(requestBody);
    await connection.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Data saved successfully', data: planet })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Something went wrong',
        error: error?.message || JSON.stringify(error)
      })
    };
  }
};