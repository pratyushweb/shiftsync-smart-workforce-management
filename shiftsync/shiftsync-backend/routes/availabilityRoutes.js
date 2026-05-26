import express from 'express';
import { getAvailability, saveAvailability } from '../controllers/availabilityController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getAvailability);
router.put('/', saveAvailability);

export default router;
