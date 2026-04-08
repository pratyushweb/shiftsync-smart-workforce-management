import { generateScheduleFromClaude } from '../services/aiService.js';
import User from '../models/User.js';
import Availability from '../models/Availability.js';
import Shift from '../models/Shift.js';
import ShiftAssignment from '../models/ShiftAssignment.js';

export const autoGenerateSchedule = async (req, res, next) => {
  const { startDate, endDate, rolesRequired } = req.body;

  try {
    // 1. Fetch available employees
    const employees = await User.find({ businessId: req.user.businessId, role: 'employee' });
    const availabilities = await Availability.find({ userId: { $in: employees.map(e => e._id) } });

    // 2. Pass to AI Service
    const aiSchedule = await generateScheduleFromClaude(
      employees,
      availabilities,
      { startDate, endDate, rolesRequired }
    );

    // 3. Parse and save objects
    const createdShifts = [];
    for (const item of aiSchedule) {
      if (item.employeeId) {
        const shift = await Shift.create({
          businessId: req.user.businessId,
          title: `AI Generated: ${item.role}`,
          shiftDate: item.shiftDate,
          startTime: item.startTime,
          endTime: item.endTime,
          createdBy: req.user._id
        });

        await ShiftAssignment.create({
          shiftId: shift._id,
          userId: item.employeeId,
          status: 'assigned'
        });

        createdShifts.push(shift);
      }
    }

    res.status(201).json({ success: true, message: 'Schedule generated successfully', data: createdShifts });
  } catch (error) {
    next(error);
  }
};
