import express from 'express';
import { body } from 'express-validator';
import { autoGenerateSchedule } from '../controllers/aiController.js';
import { verifyToken, roleCheck } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post('/generate-schedule',
  verifyToken,
  roleCheck('manager'),
  [
    body('startDate').isISO8601(),
    body('endDate').isISO8601()
  ],
  validate,
  autoGenerateSchedule
);

export default router;
