import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function setupDB() {
  const rootPool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'postgres',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    const res = await rootPool.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = 'group_matcher'`);
    if (res.rowCount === 0) {
      console.log('Creating database group_matcher...');
      await rootPool.query('CREATE DATABASE group_matcher');
    }
  } catch (err) {
    console.error('Could not create database:', err);
  } finally {
    await rootPool.end();
  }

  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'models', 'schema.sql'), 'utf-8');
    await pool.query(schemaSql);
    console.log('Database tables created successfully!');
  } catch (err) {
    console.error('Error executing schema:', err);
  } finally {
    await pool.end();
  }
}

setupDB();