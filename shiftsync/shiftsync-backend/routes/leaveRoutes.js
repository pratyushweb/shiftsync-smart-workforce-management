import express from 'express';
import { body } from 'express-validator';
import { requestLeave, handleLeaveRequest } from '../controllers/leaveController.js';
import { verifyToken, roleCheck } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(verifyToken);

router.post('/request',
  roleCheck('employee', 'manager'),
  [
    body('startDate').isISO8601(),
    body('endDate').isISO8601(),
    body('reason').notEmpty()
  ],
  validate,
  requestLeave
);

router.post('/handle',
  roleCheck('manager'),
  [
    body('leaveId').notEmpty(),
    body('status').isIn(['approved', 'rejected'])
  ],
  validate,
  handleLeaveRequest
);

export default router;
