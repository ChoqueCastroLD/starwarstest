'use strict';

const { get } = require('../../../handlers/get.js');
const { getDb } = require('../../../utils/database.js');

jest.mock('../../../utils/database');

describe('get handler', () => {
  it('should return planet data when ID is provided', async () => {
    const mockEvent = {
      pathParameters: { id: '1' }
    };

    const mockPlanetData = {
      id: 1,
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
    const mockDb = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([mockPlanetData])
    };
    const mockConnection = { end: jest.fn() };
    getDb.mockResolvedValue({ db: mockDb, connection: mockConnection });

    const result = await get(mockEvent);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(JSON.stringify({
      message: 'Planet data retrieved successfully',
      data: mockPlanetData
    }));
    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalledWith(expect.anything());
    expect(mockDb.where).toHaveBeenCalledWith({ id: '1' });
    expect(mockConnection.end).toHaveBeenCalledTimes(1);
  });

  it('should return error response when ID is missing', async () => {
    const mockEvent = {
      pathParameters: {
        id: -1
      }
    };

    const mockDb = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([])
    };
    const mockConnection = { end: jest.fn() };
    getDb.mockResolvedValue({ db: mockDb, connection: mockConnection });

    const result = await get(mockEvent);

    expect(result.statusCode).toBe(500);
    expect(result.body).toContain('Internal Server Error');
  });

  it('should return error response when database operation fails', async () => {
    const mockEvent = {
      pathParameters: { id: '1' }
    };

    const mockDbError = new Error('Database error');
    const mockDb = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockRejectedValue(mockDbError)
    };
    getDb.mockResolvedValue({ db: mockDb });

    const result = await get(mockEvent);

    expect(result.statusCode).toBe(500);
    expect(result.body).toContain('Internal Server Error');
  });
});
