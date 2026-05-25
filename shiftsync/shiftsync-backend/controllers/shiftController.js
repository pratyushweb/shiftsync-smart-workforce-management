import Shift from '../models/Shift.js';
import ShiftAssignment from '../models/ShiftAssignment.js';
import User from '../models/User.js';
import { getIO } from '../config/socket.js';

import { sendEmail } from '../utils/email.js';

export const createShift = async (req, res, next) => {
  const { title, shiftDate, startTime, endTime, assignedEmployeeId, role } = req.body;

  try {
    const shift = await Shift.create({
      businessId: req.user.businessId,
      title,
      shiftDate,
      startTime,
      endTime,
      role,
      createdBy: req.user._id
    });

    if (assignedEmployeeId) {
      await ShiftAssignment.create({
        shiftId: shift._id,
        userId: assignedEmployeeId
      });
    }

    // Return the newly created shift with employeeId populated immediately
    const populatedShift = {
      ...shift.toObject(),
      employeeId: assignedEmployeeId || null
    };

    res.status(201).json({ success: true, data: populatedShift });
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

export const getShifts = async (req, res, next) => {
  try {
    const shifts = await Shift.find({ businessId: req.user.businessId }).lean();
    
    // Find assignments for these shifts
    const shiftIds = shifts.map(s => s._id);
    const assignments = await ShiftAssignment.find({ shiftId: { $in: shiftIds } }).lean();
    
    // Map assignments back to shifts
    const populatedShifts = shifts.map(s => {
      const assignment = assignments.find(a => a.shiftId.toString() === s._id.toString());
      return {
        ...s,
        employeeId: assignment ? assignment.userId : null
      };
    });
    
    res.status(200).json({ success: true, data: populatedShifts });
  } catch (error) {
    next(error);
  }
};

export const updateShift = async (req, res, next) => {
  const { title, shiftDate, startTime, endTime, assignedEmployeeId, role } = req.body;
  const { id } = req.params;

  try {
    const shift = await Shift.findOneAndUpdate(
      { _id: id, businessId: req.user.businessId },
      { title, shiftDate, startTime, endTime, role },
      { new: true }
    );

    if (!shift) {
      return res.status(404).json({ success: false, message: 'Shift not found' });
    }

    if (assignedEmployeeId) {
      // Find and update or create assignment
      await ShiftAssignment.findOneAndUpdate(
        { shiftId: shift._id },
        { userId: assignedEmployeeId },
        { upsert: true, new: true }
      );
    } else {
      // If no employee assigned, remove any existing assignment
      await ShiftAssignment.findOneAndDelete({ shiftId: shift._id });
    }

    // Return the updated shift in populated format
    const assignment = await ShiftAssignment.findOne({ shiftId: shift._id });
    const populatedShift = {
      ...shift.toObject(),
      employeeId: assignment ? assignment.userId : null
    };

    res.status(200).json({ success: true, data: populatedShift });
  } catch (error) {
    next(error);
  }
};

export const deleteShift = async (req, res, next) => {
  const { id } = req.params;

  try {
    const shift = await Shift.findOneAndDelete({ _id: id, businessId: req.user.businessId });

    if (!shift) {
      return res.status(404).json({ success: false, message: 'Shift not found' });
    }

    // Delete associated assignments too
    await ShiftAssignment.deleteMany({ shiftId: id });

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
