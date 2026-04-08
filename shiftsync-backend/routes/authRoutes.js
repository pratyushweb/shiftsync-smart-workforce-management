import express from 'express';
import { body } from 'express-validator';
import { registerManager, login, refresh } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post('/register', [
  body('businessName').notEmpty().withMessage('Business name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('fullName').notEmpty().withMessage('Full name is required')
], validate, registerManager);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], validate, login);

router.post('/refresh', refresh);

export default router;
