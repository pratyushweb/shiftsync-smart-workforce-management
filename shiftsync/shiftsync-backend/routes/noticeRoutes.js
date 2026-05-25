import express from 'express';
import { body } from 'express-validator';
import { createNotice } from '../controllers/noticeController.js';
import { verifyToken, roleCheck } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(verifyToken);

router.post('/create',
  roleCheck('manager'),
  [body('content').notEmpty().withMessage('Content cannot be empty')],
  validate,
  createNotice
);

export default router;
