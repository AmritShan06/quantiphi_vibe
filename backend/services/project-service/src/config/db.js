const { Pool } = require('pg');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

let mode = 'sqlite';
let pgPool = null;
let sqliteDb = null;

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5432;
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgrespassword';
const DB_NAME = process.env.DB_NAME || 'quantiphi_db';

const dataDir = path.join(__dirname, '../../../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const dbPath = path.join(dataDir, 'quantiphi_store.db');

try {
  sqliteDb = new Database(dbPath);
} catch (err) {
  console.error('[DB Config] SQLite load error:', err.message);
}

pgPool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  connectionTimeoutMillis: 2000
});

pgPool.connect((err, client, release) => {
  if (err) {
    mode = 'sqlite';
  } else {
    mode = 'postgres';
    release();
  }
});

async function query(text, params = []) {
  if (mode === 'postgres') {
    try {
      const res = await pgPool.query(text, params);
      return res.rows;
    } catch (err) {
      console.warn('[Postgres Query Error, using SQLite]', err.message);
    }
  }

  let sqliteQuery = text;
  sqliteQuery = sqliteQuery.replace(/\$\d+/g, '?');

  try {
    const stmt = sqliteDb.prepare(sqliteQuery);
    if (sqliteQuery.trim().toUpperCase().startsWith('SELECT') || sqliteQuery.includes('RETURNING')) {
      return stmt.all(params);
    } else {
      const info = stmt.run(params);
      return [{ affectedRows: info.changes }];
    }
  } catch (err) {
    console.error('[SQLite Query Error]', err.message);
    throw err;
  }
}

module.exports = { query };
