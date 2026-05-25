import express from 'express';
import { body } from 'express-validator';
import { clockIn, clockOut } from '../controllers/attendanceController.js';
import { verifyToken, roleCheck } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(verifyToken, roleCheck('employee', 'manager'));

router.post('/clock-in', 
  [body('shiftAssignmentId').notEmpty().withMessage('Shift Assignment ID is required')],
  validate,
  clockIn
);

router.post('/clock-out',
  [body('attendanceId').notEmpty().withMessage('Attendance ID is required')],
  validate,
  clockOut
);

export default router;
