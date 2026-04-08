import dotenv from 'dotenv';
// Load dot env before any other imports
dotenv.config();
console.log('[Bootstrap] Environment variables loaded.');

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import connectDB from './config/db.js';
import { initSocket } from './config/socket.js';



console.log('[Bootstrap] Initializing route imports...');
import authRoutes from './routes/authRoutes.js';
import inviteRoutes from './routes/inviteRoutes.js';
import shiftRoutes from './routes/shiftRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import swapRoutes from './routes/swapRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import { startCronJobs } from './config/cron.js';



// Connect to Database
connectDB().then(() => {
  console.log('[Database] Ready for operations.');
}).catch(err => {
  console.error('[Database] Connection failed critical error:', err);
});


// Initialize Daily Jobs
startCronJobs();

const app = express();
const httpServer = createServer(app);

console.log('[Bootstrap] Initializing Socket.io...');
// Init Socket.io
export const io = initSocket(httpServer);



// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.FRONTEND_URL, // e.g. https://shiftsync.vercel.app
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/invite', inviteRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/swap', swapRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reports', reportRoutes);

console.log('[Bootstrap] Routes registered.');


// Basic Route for testing
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'ShiftSync API is running!' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
