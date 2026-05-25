import express from 'express';
import { getEmployees, createEmployee, updateEmployee } from '../controllers/employeeController.js';
import { verifyToken, roleCheck } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);
router.get('/', roleCheck('manager', 'employee'), getEmployees);
router.post('/', roleCheck('manager'), createEmployee);
router.put('/:id', roleCheck('manager'), updateEmployee);

export default router;
