import Shift from '../models/Shift.js';
import ShiftAssignment from '../models/ShiftAssignment.js';
import User from '../models/User.js';
import { getIO } from '../config/socket.js';

import { sendEmail } from '../utils/email.js';

export const createShift = async (req, res, next) => {
  const { title, shiftDate, startTime, endTime, assignedEmployeeId } = req.body;

  try {
    const shift = await Shift.create({
      businessId: req.user.businessId,
      title,
      shiftDate,
      startTime,
      endTime,
      createdBy: req.user._id
    });

    if (assignedEmployeeId) {
      await ShiftAssignment.create({
        shiftId: shift._id,
        userId: assignedEmployeeId
      });
    }

    res.status(201).json({ success: true, data: shift });
  } catch (error) {
    next(error);
  }
};

export const publishShifts = async (req, res, next) => {
  const { startDate, endDate } = req.body;

  try {
    // Find all shifts in this range for the business
    const shifts = await Shift.find({
      businessId: req.user.businessId,
      shiftDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });

    const shiftIds = shifts.map(s => s._id);

    // Update assignment status
    await ShiftAssignment.updateMany(
      { shiftId: { $in: shiftIds }, status: 'assigned' },
      { $set: { status: 'published' } }
    );

    // Notify employees
    getIO().emit('schedule_published', { message: 'A new schedule has been published.', businessId: req.user.businessId });


    // Optional: Fetch all unique users assigned and send emails
    const assignments = await ShiftAssignment.find({ shiftId: { $in: shiftIds } }).populate('userId');
    const userEmails = [...new Set(assignments.map(a => a.userId.email))];

    for (const email of userEmails) {
      await sendEmail({
        to: email,
        subject: 'New Work Schedule Published',
        text: 'Your manager has published a new schedule. Please check ShiftSync.',
        html: '<p>Your manager has published a new schedule. Please check ShiftSync.</p>'
      });
    }

    res.status(200).json({ success: true, message: 'Shifts published successfully' });
  } catch (error) {
    next(error);
  }
};
