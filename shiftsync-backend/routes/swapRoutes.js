import express from 'express';
import { body } from 'express-validator';
import { requestSwap, respondToSwap, managerApproveSwap } from '../controllers/swapController.js';
import { verifyToken, roleCheck } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(verifyToken);

router.post('/request',
  roleCheck('employee', 'manager'),
  [
    body('shiftAssignmentId').notEmpty().withMessage('Shift Assignment ID required'),
    body('targetUserId').notEmpty().withMessage('Target User ID required')
  ],
  validate,
  requestSwap
);

router.post('/respond',
  roleCheck('employee', 'manager'),
  [
    body('swapId').notEmpty(),
    body('response').isIn(['accepted', 'rejected'])
  ],
  validate,
  respondToSwap
);

router.post('/manager-approve',
  roleCheck('manager'),
  [
    body('swapId').notEmpty(),
    body('approved').isBoolean()
  ],
  validate,
  managerApproveSwap
);

export default router;
