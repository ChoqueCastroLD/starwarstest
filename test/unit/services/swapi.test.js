'use strict';

jest.mock('axios');

const { getPlanet } = require('../../../services/swapi.js');

describe('getPlanet', () => {
  it('should fetch planet data from API and translate it', async () => {
    const mockPlanetData = {
      name: 'Tatooine',
      rotation_period: '23',
      orbital_period: '304',
      diameter: '10465',
      climate: 'arid',
      gravity: '1 standard',
      terrain: 'desert',
      surface_water: '1',
      population: '200000'
    };

    const mockResponse = {
      data: mockPlanetData
    };

    require('axios').get.mockResolvedValue(mockResponse);

    const translatedPlanet = await getPlanet('1');

    expect(translatedPlanet).toEqual({
      nombre: 'Tatooine',
      periodo_rotacion: '23',
      periodo_orbital: '304',
      diametro: '10465',
      clima: 'arid',
      gravedad: '1 standard',
      terreno: 'desert',
      agua_superficial: '1',
      poblacion: '200000'
    });
  });

  it('should handle planet not found error', async () => {
    const mockError = new Error('Planet not found');
    require('axios').get.mockRejectedValue(mockError);

    const result = await getPlanet('invalid_id');

    expect(result).toEqual(mockError);
  });

  it('should return error for invalid response', async () => {
    const mockResponse = {
      data: null
    };

    require('axios').get.mockResolvedValue(mockResponse);

    const result = await getPlanet('1');

    expect(result).toEqual(new Error('Planet not found'));
  });
});
