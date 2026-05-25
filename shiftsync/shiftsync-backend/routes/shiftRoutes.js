import express from 'express';
import { body } from 'express-validator';
import { createShift, publishShifts, getShifts, updateShift, deleteShift } from '../controllers/shiftController.js';
import { verifyToken, roleCheck } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getShifts);

router.post('/', 
  roleCheck('manager'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('shiftDate').isISO8601().withMessage('Valid date is required'),
    body('startTime').notEmpty().withMessage('Start time is required'),
    body('endTime').notEmpty().withMessage('End time is required')
  ],
  validate,
  createShift
);

router.post('/publish',
  roleCheck('manager'),
  [
    body('startDate').isISO8601().withMessage('Start date is required'),
    body('endDate').isISO8601().withMessage('End date is required')
  ],
  validate,
  publishShifts
);

router.put('/:id', roleCheck('manager'), updateShift);
router.delete('/:id', roleCheck('manager'), deleteShift);

export default router;
