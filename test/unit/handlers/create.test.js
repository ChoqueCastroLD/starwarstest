'use strict';

const { create } = require('../../../handlers/create.js');

jest.mock('../../../utils/database.js');

describe('create handler', () => {
    it('should create a planet and return success response', async () => {
        const mockEvent = {
            body: {
                nombre: 'Test Planet',
                periodo_rotacion: 23,
                periodo_orbital: 304,
                diametro: 10465,
                clima: 'arid',
                gravedad: '1 standard',
                terreno: 'desert',
                agua_superficial: '1',
                poblacion: 200000
            }
        };

        const mockDb = {
            insert: jest.fn().mockReturnThis(),
            values: jest.fn().mockResolvedValue([{ insertId: 123 }]) // Assuming an insertId of 123
        };
        const mockConnection = { end: jest.fn() };
        require('../../../utils/database').getDb.mockResolvedValue({ db: mockDb, connection: mockConnection });

        const result = await create(mockEvent);

        expect(result.statusCode).toBe(200);
        expect(result.body).toEqual(JSON.stringify({ message: 'Data saved successfully', data: { insertId: 123 } }));
        expect(mockDb.insert).toHaveBeenCalledWith(expect.anything());
        expect(mockDb.values).toHaveBeenCalledWith(mockEvent.body);
        expect(mockConnection.end).toHaveBeenCalledTimes(1);
    });

    it('should return error response when validation fails', async () => {
        const mockEvent = {
            body: {
                "periodo_rotacion": 23,
                "periodo_orbital": 304,
                "diametro": 10465,
                "clima": "arid",
                "gravedad": "1 standard",
                "terreno": "desert",
                "agua_superficial": "1",
                "poblacion": 200000
            }
        };

        const result = await create(mockEvent);

        expect(result.statusCode).toBe(500);
        expect(result.body).toContain('Something went wrong');
        expect(result.body).toContain('Missing field: nombre');
    });

    it('should return error response when database operation fails', async () => {
        const mockEvent = {
            body: {
                "nombre": "Ficticius",
                "periodo_rotacion": 23,
                "periodo_orbital": 304,
                "diametro": 10465,
                "clima": "arid",
                "gravedad": "1 standard",
                "terreno": "desert",
                "agua_superficial": "1",
                "poblacion": 200000
            }
        };

        const mockDbError = new Error('Database error');
        const mockDb = {
            insert: jest.fn().mockReturnThis(),
            values: jest.fn().mockRejectedValue(mockDbError)
        };
        require('../../../utils/database').getDb.mockResolvedValue({ db: mockDb });

        const result = await create(mockEvent);

        expect(result.statusCode).toBe(500);
        expect(result.body).toContain('Something went wrong');
        expect(result.body).toContain('Database error');
    });
});
