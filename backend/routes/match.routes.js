import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { getMatchesForUser } from '../services/matching.service.js';
import pool from '../config/db.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
    try {
        const matches = await getMatchesForUser(req.user.id);
        res.json(matches);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error determining matches' });
    }
});

router.get('/groups', authenticate, async (req, res) => {
    try {
        const userResult = await pool.query('SELECT interests FROM users WHERE id = $1', [req.user.id]);
        const interests = userResult.rows[0]?.interests || [];

        const groupsResult = await pool.query(
            `SELECT g.*, COUNT(gm.user_id)::int AS members
             FROM groups g
             LEFT JOIN group_members gm ON gm.group_id = g.id
             WHERE g.id NOT IN (SELECT group_id FROM group_members WHERE user_id = $1)
             GROUP BY g.id
             ORDER BY CASE WHEN g.subject = ANY($2::text[]) THEN 0 ELSE 1 END, g.created_at DESC
             LIMIT 20`,
            [req.user.id, interests]
        );

        res.json(groupsResult.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch group matches' });
    }
});

// Record a swipe/interaction
router.post('/action', authenticate, async (req, res) => {
    const { targetUserId, action } = req.body; // action: 'LIKE', 'PASS'
    try {
        await pool.query(
            'INSERT INTO user_interactions (source_user_id, target_user_id, interaction_type) VALUES ($1, $2, $3)',
            [req.user.id, targetUserId, action]
        );
        
        if (action === 'LIKE') {
            // Check for mutual match
            const reverseActionReq = await pool.query(
                `SELECT * FROM user_interactions 
                 WHERE source_user_id = $1 AND target_user_id = $2 AND interaction_type = 'LIKE'`,
                 [targetUserId, req.user.id]
            );
            if (reverseActionReq.rows.length > 0) {
                 // It's a mutual match! We could create a direct chat or group here.
                 return res.json({ mutualMatch: true, message: 'It\'s a match!' });
            }
        }
        res.json({ mutualMatch: false, message: 'Action recorded' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error recording action' });
    }
});

export default router;