import express from 'express';
import pool from '../config/db.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
	try {
		const result = await pool.query(
			`SELECT s.id, s.title, s.starts_at, s.duration_minutes, s.group_id, g.name AS group_name
			 FROM sessions s
			 JOIN groups g ON g.id = s.group_id
			 WHERE s.group_id IN (
				 SELECT group_id FROM group_members WHERE user_id = $1
			 )
			 ORDER BY s.starts_at ASC
			 LIMIT 20`,
			[req.user.id]
		);
		res.json(result.rows);
	} catch (err) {
		res.status(500).json({ message: 'Failed to fetch sessions' });
	}
});

export default router;