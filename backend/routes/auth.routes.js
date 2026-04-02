import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password, name } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, onboarding_completed`,
      [email, hashedPassword, name]
    );

    const token = jwt.sign({ id: result.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
       return res.status(400).json({ message: 'Email already exists' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', [
  body('email').isEmail(),
  body('password').exists()
], async (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
   const { email, password } = req.body;
   try {
     const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
     if (userResult.rows.length === 0) return res.status(400).json({ message: 'Invalid credentials' });
     const user = userResult.rows[0];
     const isMatch = await bcrypt.compare(password, user.password_hash);
     if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

     const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
     delete user.password_hash;
     res.json({ token, user });
   } catch (err) {
     console.error(err);
     res.status(500).json({ message: 'Server error' });
   }
});

router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query(
      `SELECT id, email, name, bio, interests, skills, location, languages, availability, onboarding_completed
       FROM users WHERE id = $1`,
      [decoded.id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

export default router;