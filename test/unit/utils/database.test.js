'use strict';

jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

jest.mock('mysql2/promise', () => ({
  createConnection: jest.fn().mockResolvedValue({
    query: jest.fn(),
  }),
}));

jest.mock('drizzle-orm/mysql2', () => ({
  drizzle: jest.fn(),
}));

const { getDb } = require('../../../utils/database.js');

describe('getDb', () => {
  it('should create connection with correct parameters', async () => {
    process.env.DB_HOST = 'localhost';
    process.env.DB_USER = 'user';
    process.env.DB_PASSWORD = 'password';
    process.env.DB_NAME = 'test_db';

    await getDb();

    expect(require('mysql2/promise').createConnection).toHaveBeenCalledWith({
      host: 'localhost',
      user: 'user',
      password: 'password',
      database: 'test_db',
    });
  });

  it('should call drizzle with correct parameters', async () => {
    const mockConnection = { query: jest.fn() };
    require('mysql2/promise').createConnection.mockResolvedValue(mockConnection);

    await getDb();

    expect(require('drizzle-orm/mysql2').drizzle).toHaveBeenCalledWith(mockConnection, { schema: expect.any(Object), mode: 'default' });
  });

  it('should return db and connection', async () => {
    const mockConnection = { query: jest.fn() };
    const mockDb = { foo: 'bar' };
    require('mysql2/promise').createConnection.mockResolvedValue(mockConnection);
    require('drizzle-orm/mysql2').drizzle.mockReturnValue(mockDb);

    const result = await getDb();

    expect(result).toEqual({ db: mockDb, connection: mockConnection });
  });
});
