import pool from './config/db.js';
import bcrypt from 'bcrypt';

async function reset() {
  const hash = await bcrypt.hash('password123', 10);
  await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [hash, 'admin@hako.ai']);
  console.log('Password reset to password123 successfully!');
  process.exit(0);
}
reset();