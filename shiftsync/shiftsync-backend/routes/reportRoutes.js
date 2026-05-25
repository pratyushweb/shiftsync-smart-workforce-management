import express from 'express';
import { getAttendanceReport, exportAttendanceCSV } from '../controllers/reportController.js';
import { verifyToken, roleCheck } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken, roleCheck('manager'));

router.get('/attendance', getAttendanceReport);
router.get('/export', exportAttendanceCSV);

export default router;
