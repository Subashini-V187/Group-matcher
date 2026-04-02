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

  const { email, password, name, bio, subjects, skills, location, languages, availability } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name, bio, subjects, skills, location, languages, availability) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, email, name`,
      [email, hashedPassword, name, bio, JSON.stringify(subjects), JSON.stringify(skills), location, JSON.stringify(languages), JSON.stringify(availability)]
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

export default router;