import express from 'express';
import pool from '../config/db.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/me', authenticate, async (req, res) => {
	try {
		const result = await pool.query(
			`SELECT id, email, name, bio, interests, skills, location, languages, availability, onboarding_completed
			 FROM users
			 WHERE id = $1`,
			[req.user.id]
		);
		res.json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ message: 'Failed to fetch profile' });
	}
});

router.put('/update', authenticate, async (req, res) => {
	const {
		name,
		bio,
		interests,
		skills,
		location,
		languages,
		availability,
		onboarding_completed,
	} = req.body;

	try {
		const result = await pool.query(
			`UPDATE users
			 SET name = COALESCE($1, name),
					 bio = COALESCE($2, bio),
					 interests = COALESCE($3, interests),
					 skills = COALESCE($4, skills),
					 location = COALESCE($5, location),
					 languages = COALESCE($6, languages),
					 availability = COALESCE($7, availability),
					 onboarding_completed = COALESCE($8, onboarding_completed),
					 updated_at = CURRENT_TIMESTAMP
			 WHERE id = $9
			 RETURNING id, email, name, bio, interests, skills, location, languages, availability, onboarding_completed`,
			[
				name ?? null,
				bio ?? null,
				interests ? JSON.stringify(interests) : null,
				skills ? JSON.stringify(skills) : null,
				location ?? null,
				languages ? JSON.stringify(languages) : null,
				availability ? JSON.stringify(availability) : null,
				typeof onboarding_completed === 'boolean' ? onboarding_completed : null,
				req.user.id,
			]
		);

		res.json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ message: 'Failed to update profile' });
	}
});

export default router;