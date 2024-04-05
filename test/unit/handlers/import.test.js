'use strict';

const { import: importHandler } = require('../../../handlers/import.js');
const { getPlanet } = require('../../../services/swapi.js');
const { getDb } = require('../../../utils/database.js');

jest.mock('../../../services/swapi');
jest.mock('../../../utils/database');

describe('import handler', () => {
  it('should import a planet successfully', async () => {
    const mockEvent = {
      body: { id: '1' }
    };
    const mockSwapiPlanet = {
      id: '1',
      nombre: 'Test Planet',
      periodo_rotacion: 23,
      periodo_orbital: 304,
      diametro: 10465,
      clima: 'arid',
      gravedad: '1 standard',
      terreno: 'desert',
      agua_superficial: '1',
      poblacion: 200000
    };
    getPlanet.mockResolvedValue(mockSwapiPlanet);

    const mockDb = {
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockResolvedValue([{ insertId: 123 }]) // Assuming an insertId of 123
    };
    const mockConnection = { end: jest.fn() };
    getDb.mockResolvedValue({ db: mockDb, connection: mockConnection });

    const result = await importHandler(mockEvent);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(JSON.stringify({
      message: 'Data saved successfully, returning the ID',
      data: 123
    }));
    expect(mockDb.insert).toHaveBeenCalledWith(expect.anything());
    expect(mockDb.values).toHaveBeenCalledWith(mockSwapiPlanet);
    expect(mockConnection.end).toHaveBeenCalledTimes(1);
  });

  it('should return error response when ID is missing', async () => {
    const mockEvent = {
      body: {}
    };

    const result = await importHandler(mockEvent);

    expect(result.statusCode).toBe(500);
    expect(result.body).toContain('Internal Server Error');
  });

  it('should return error response when planet is not found', async () => {
    const mockEvent = {
      body: { id: '999' } // Assuming this ID doesn't exist
    };
    getPlanet.mockResolvedValue(null);

    const result = await importHandler(mockEvent);

    expect(result.statusCode).toBe(500);
    expect(result.body).toContain('Internal Server Error');
  });

  it('should return error response when database operation fails', async () => {
    const mockEvent = {
      body: { id: '1' }
    };
    const mockSwapiPlanet = {
      id: '1',
      nombre: 'Test Planet',
      periodo_rotacion: 23,
      periodo_orbital: 304,
      diametro: 10465,
      clima: 'arid',
      gravedad: '1 standard',
      terreno: 'desert',
      agua_superficial: '1',
      poblacion: 200000
    };
    getPlanet.mockResolvedValue(mockSwapiPlanet);

    const mockDbError = new Error('Database error');
    const mockDb = {
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockRejectedValue(mockDbError)
    };
    getDb.mockResolvedValue({ db: mockDb });

    const result = await importHandler(mockEvent);

    expect(result.statusCode).toBe(500);
    expect(result.body).toContain('Internal Server Error');
  });
});
