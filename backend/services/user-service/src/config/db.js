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
  sqliteDb.pragma('journal_mode = WAL');
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      avatar_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS project_users (
      project_id TEXT,
      user_id TEXT,
      PRIMARY KEY (project_id, user_id)
    );
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      project_id TEXT,
      assignee_id TEXT,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT CHECK (priority IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
      status TEXT CHECK (status IN ('To-Do', 'In Progress', 'Done')) DEFAULT 'To-Do',
      due_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log(`[DB Config] SQLite initialized at ${dbPath}`);
} catch (err) {
  console.error('[DB Config] SQLite error:', err.message);
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
    console.log('[DB Config] PostgreSQL unreachable. Using SQLite Fallback Mode.');
    mode = 'sqlite';
  } else {
    console.log(`[DB Config] Connected to PostgreSQL at ${DB_HOST}:${DB_PORT}/${DB_NAME}`);
    mode = 'postgres';
    release();
    const initPgTables = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS project_users (
        project_id VARCHAR(36),
        user_id VARCHAR(36),
        PRIMARY KEY (project_id, user_id)
      );
      CREATE TABLE IF NOT EXISTS tasks (
        id VARCHAR(36) PRIMARY KEY,
        project_id VARCHAR(36),
        assignee_id VARCHAR(36),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        priority VARCHAR(20) DEFAULT 'Medium',
        status VARCHAR(20) DEFAULT 'To-Do',
        due_date VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    pgPool.query(initPgTables).catch(e => console.error('[PG Migration Error]', e.message));
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
