import Attendance from '../models/Attendance.js';
import ShiftAssignment from '../models/ShiftAssignment.js';
import Shift from '../models/Shift.js';

export const clockIn = async (req, res, next) => {
  const { shiftAssignmentId } = req.body;

  try {
    const assignment = await ShiftAssignment.findOne({ _id: shiftAssignmentId, userId: req.user._id }).populate('shiftId');
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Shift assignment not found' });
    }

    const shift = assignment.shiftId;
    const now = new Date();
    
    // Parse expected start time
    const [hours, minutes] = shift.startTime.split(':');
    const expectedStart = new Date(shift.shiftDate);
    expectedStart.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);

    // Check if late (> 10 minutes)
    const tenMinutesInMs = 10 * 60 * 1000;
    const isLate = (now.getTime() - expectedStart.getTime()) > tenMinutesInMs;

    const attendance = await Attendance.create({
      shiftAssignmentId,
      userId: req.user._id,
      clockIn: now,
      isLate
    });

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    next(error);
  }
};

export const clockOut = async (req, res, next) => {
  const { attendanceId } = req.body;

  try {
    const attendance = await Attendance.findOne({ _id: attendanceId, userId: req.user._id });
    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    if (attendance.clockOut) {
      return res.status(400).json({ success: false, message: 'Already clocked out' });
    }

    attendance.clockOut = new Date();
    await attendance.save();

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    next(error);
  }
};
