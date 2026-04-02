import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const seedSubjects = [
  'Math', 'Physics', 'Chemistry', 'Biology', 'AI', 'ML', 'Economics', 'Philosophy',
  'Literature', 'History', 'Data Science', 'Robotics', 'Astronomy', 'Psychology',
  'Design', 'Cybersecurity', 'Statistics', 'Finance', 'Sociology', 'Programming'
];

function buildSeedGroups() {
  const groups = [];
  for (let i = 0; i < 60; i += 1) {
    const subject = seedSubjects[i % seedSubjects.length];
    groups.push({
      name: `${subject} Collective ${i + 1}`,
      description: `Focused peer learning cohort for ${subject}.`,
      subject,
      level: ['Beginner', 'Intermediate', 'Advanced'][i % 3],
      max_members: 20 + (i % 11),
    });
  }
  return groups;
}

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

    // Backward-compatible migration for older databases.
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS interests JSONB DEFAULT '[]'::jsonb");
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false');
    await pool.query("UPDATE users SET interests = COALESCE(interests, subjects, '[]'::jsonb)");

    const groupCount = await pool.query('SELECT COUNT(*)::int AS count FROM groups');
    if (groupCount.rows[0].count < 50) {
      const groups = buildSeedGroups();
      for (const group of groups) {
        await pool.query(
          `INSERT INTO groups (name, description, subject, level, max_members)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT DO NOTHING`,
          [group.name, group.description, group.subject, group.level, group.max_members]
        );
      }

      const allGroups = await pool.query('SELECT id, name FROM groups ORDER BY id ASC LIMIT 60');
      for (let i = 0; i < allGroups.rows.length; i += 1) {
        const g = allGroups.rows[i];
        const startsAt = new Date(Date.now() + (i + 1) * 60 * 60 * 1000);
        await pool.query(
          `INSERT INTO sessions (group_id, title, starts_at, duration_minutes)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT DO NOTHING`,
          [g.id, `${g.name} Session`, startsAt.toISOString(), 60]
        );
      }
    }
    console.log('Database tables created successfully!');
  } catch (err) {
    console.error('Error executing schema:', err);
  } finally {
    await pool.end();
  }
}

setupDB();