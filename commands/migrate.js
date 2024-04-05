'use strict';

const { getDb } = require('../utils/database.js');

async function migrate() {
    const { db } = await getDb();
    await migrate(db, { migrationsFolder: '../drizzle' });
    await connection.end();
}

migrate()
    .then(() => console.log('Migration completed'))
    .catch((error) => console.error('Error migrating', error));
