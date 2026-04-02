import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import pool from '../config/db.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { getSocket } from '../socket.js';

const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => cb(null, uploadsDir),
	filename: (_req, file, cb) => {
		const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		cb(null, `${unique}${path.extname(file.originalname)}`);
	},
});

const upload = multer({ storage });

router.get('/:groupId/messages', authenticate, async (req, res) => {
	const { groupId } = req.params;
	try {
		const result = await pool.query(
			`SELECT cm.id, cm.group_id, cm.user_id, cm.message_type, cm.content, cm.image_url, cm.created_at, u.name AS username
			 FROM chat_messages cm
			 JOIN users u ON u.id = cm.user_id
			 WHERE cm.group_id = $1
			 ORDER BY cm.created_at ASC
			 LIMIT 200`,
			[groupId]
		);
		res.json(result.rows);
	} catch (err) {
		res.status(500).json({ message: 'Failed to fetch messages' });
	}
});

router.post('/:groupId/messages', authenticate, async (req, res) => {
	const { groupId } = req.params;
	const { content, messageType = 'text', imageUrl = null } = req.body;
	try {
		const result = await pool.query(
			`INSERT INTO chat_messages (group_id, user_id, message_type, content, image_url)
			 VALUES ($1, $2, $3, $4, $5)
			 RETURNING id, group_id, user_id, message_type, content, image_url, created_at`,
			[groupId, req.user.id, messageType, content || null, imageUrl]
		);

		const withUser = await pool.query('SELECT name FROM users WHERE id = $1', [req.user.id]);
		const payload = { ...result.rows[0], username: withUser.rows[0]?.name || 'User' };

		const io = getSocket();
		if (io) {
			io.to(`group:${groupId}`).emit('chat-message', payload);
		}

		res.status(201).json(payload);
	} catch (err) {
		res.status(500).json({ message: 'Failed to send message' });
	}
});

router.post('/:groupId/upload', authenticate, upload.single('image'), async (req, res) => {
	const { groupId } = req.params;
	try {
		if (!req.file) {
			return res.status(400).json({ message: 'No image uploaded' });
		}

		const imageUrl = `/uploads/${req.file.filename}`;
		const result = await pool.query(
			`INSERT INTO chat_messages (group_id, user_id, message_type, image_url)
			 VALUES ($1, $2, 'image', $3)
			 RETURNING id, group_id, user_id, message_type, content, image_url, created_at`,
			[groupId, req.user.id, imageUrl]
		);

		const withUser = await pool.query('SELECT name FROM users WHERE id = $1', [req.user.id]);
		const payload = { ...result.rows[0], username: withUser.rows[0]?.name || 'User' };

		const io = getSocket();
		if (io) {
			io.to(`group:${groupId}`).emit('chat-message', payload);
		}

		res.status(201).json(payload);
	} catch (err) {
		res.status(500).json({ message: 'Failed to upload image' });
	}
});

export default router;