import express from 'express';
import { body } from 'express-validator';
import { requestSwap, respondToSwap, managerApproveSwap, getSwaps } from '../controllers/swapController.js';
import { verifyToken, roleCheck } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', roleCheck('employee', 'manager'), getSwaps);

router.post('/request',
  roleCheck('employee', 'manager'),
  [
    body('targetUserId').notEmpty().withMessage('Target User ID required'),
    body().custom(body => {
      if (!body.shiftAssignmentId && !body.shiftId) {
        throw new Error('Either shiftAssignmentId or shiftId is required');
      }
      return true;
    })
  ],
  validate,
  requestSwap
);

router.post('/',
  roleCheck('employee', 'manager'),
  [
    body('targetUserId').notEmpty().withMessage('Target User ID required'),
    body().custom(body => {
      if (!body.shiftAssignmentId && !body.shiftId) {
        throw new Error('Either shiftAssignmentId or shiftId is required');
      }
      return true;
    })
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
