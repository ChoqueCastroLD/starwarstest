'use strict';

require('dotenv').config();

const axios = require('axios');

async function getPlanet(id = "") {
    try {
        const response = await axios.get(`https://swapi.py4e.com/api/planets/${id}/`);
        const planet = response?.data;

        if (!planet) {
            throw new Error('Planet not found');
        }

        const translatedPlanet = {
            nombre: planet.name,
            periodo_rotacion: planet.rotation_period,
            periodo_orbital: planet.orbital_period,
            diametro: planet.diameter,
            clima: planet.climate,
            gravedad: planet.gravity,
            terreno: planet.terrain,
            agua_superficial: planet.surface_water,
            poblacion: planet.population
        };

        return translatedPlanet;
    } catch (error) {
        return error;
    }
};

module.exports = { getPlanet };
