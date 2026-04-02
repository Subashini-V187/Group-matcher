import express from 'express';
import pool from '../config/db.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM groups ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching groups' });
  }
});

router.get('/mine', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT g.*, gm.joined_at
       FROM group_members gm
       JOIN groups g ON g.id = gm.group_id
       WHERE gm.user_id = $1
       ORDER BY gm.joined_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch joined groups' });
  }
});

router.get('/suggested', authenticate, async (req, res) => {
  try {
    const userResult = await pool.query('SELECT interests FROM users WHERE id = $1', [req.user.id]);
    const interests = userResult.rows[0]?.interests || [];

    const result = await pool.query(
      `SELECT g.*, COUNT(gm.user_id)::int AS members
       FROM groups g
       LEFT JOIN group_members gm ON gm.group_id = g.id
       WHERE g.id NOT IN (
         SELECT group_id FROM group_members WHERE user_id = $1
       )
       GROUP BY g.id
       ORDER BY CASE WHEN g.subject = ANY($2::text[]) THEN 0 ELSE 1 END, g.created_at DESC
       LIMIT 16`,
      [req.user.id, interests]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch suggested groups' });
  }
});

router.post('/:id/join', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      `INSERT INTO group_members (group_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT (group_id, user_id) DO NOTHING`,
      [id, req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to join group' });
  }
});

router.post('/:id/leave', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM group_members WHERE group_id = $1 AND user_id = $2', [id, req.user.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to leave group' });
  }
});

export default router;