'use strict';

const { planetsSchema } = require("../models/planets.js");
const { getDb } = require("../utils/database.js");

module.exports.get = async (event) => {
    try {
        const requestParameters = typeof event.pathParameters === 'string' ? JSON.parse(event.pathParameters) : event.pathParameters;
        const id = requestParameters.id;

        const { db, connection } = await getDb();
        const [ planet ] = await db.select().from(planetsSchema).where({ id });
        await connection.end();

        if (!planet) {
            throw new Error('Planet not found');
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Planet data retrieved successfully',
                data: planet
            })
        };
    } catch (error) {
        return {
            statusCode: error.response ? error.response.status : 500,
            body: JSON.stringify({
                message: 'Internal Server Error',
                error: JSON.stringify(error)
            })
        };
    }
};
