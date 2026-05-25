import express from 'express';
import { body } from 'express-validator';
import { sendInvite, employeeSignup } from '../controllers/inviteController.js';
import { verifyToken, roleCheck } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post('/send', 
  verifyToken, 
  roleCheck('manager'), 
  [body('email').isEmail().withMessage('Valid email is required')], 
  validate, 
  sendInvite
);

router.post('/signup', 
  [
    body('token').notEmpty().withMessage('Token is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('fullName').notEmpty().withMessage('Full name is required')
  ], 
  validate, 
  employeeSignup
);

export default router;
