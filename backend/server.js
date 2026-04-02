import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import { errorHandler } from './middleware/error.middleware.js';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import groupRoutes from './routes/group.routes.js';
import matchRoutes from './routes/match.routes.js';
import sessionRoutes from './routes/session.routes.js';
import chatRoutes from './routes/chat.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import notesRoutes from './routes/notes.routes.js';
import { initSocket } from './socket.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

initSocket(io);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/notes', notesRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Hako AI System backend initialized on port ${PORT}`);
});
