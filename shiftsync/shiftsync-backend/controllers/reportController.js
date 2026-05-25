import { Parser } from 'json2csv';
import Attendance from '../models/Attendance.js';
import ShiftAssignment from '../models/ShiftAssignment.js';

export const getAttendanceReport = async (req, res, next) => {
  try {
    const assignments = await ShiftAssignment.find({ status: 'completed' })
      .populate({ path: 'shiftId', match: { businessId: req.user.businessId } })
      .populate('userId');

    // Filter out null shifts if populated match failed
    const validAssignments = assignments.filter(a => a.shiftId !== null);

    const reportData = [];
    let totalShifts = validAssignments.length;
    let lateCount = 0;

    for (const assignment of validAssignments) {
      const attendance = await Attendance.findOne({ shiftAssignmentId: assignment._id });
      
      const isLate = attendance ? attendance.isLate : false;
      if (isLate) lateCount++;

      // Simple hours calculation
      let hoursWorked = 0;
      if (attendance && attendance.clockOut && attendance.clockIn) {
        hoursWorked = (attendance.clockOut - attendance.clockIn) / (1000 * 60 * 60);
      }

      reportData.push({
        Employee: assignment.userId.fullName,
        Email: assignment.userId.email,
        Date: assignment.shiftId.shiftDate.toISOString().split('T')[0],
        ExpectedStart: assignment.shiftId.startTime,
        ClockIn: attendance && attendance.clockIn ? attendance.clockIn.toISOString() : 'Missed',
        Late: isLate ? 'Yes' : 'No',
        HoursWorked: hoursWorked.toFixed(2)
      });
    }

    res.status(200).json({
      success: true,
      summary: {
        totalShifts,
        lateCount,
        attendanceRate: totalShifts ? (((totalShifts - lateCount) / totalShifts) * 100).toFixed(1) + '%' : '0%'
      },
      data: reportData
    });
  } catch (error) {
    next(error);
  }
};

export const exportAttendanceCSV = async (req, res, next) => {
  try {
    // Generate data identical to getAttendanceReport
    const assignments = await ShiftAssignment.find({ status: 'completed' }).populate('shiftId').populate('userId');
    const validAssignments = assignments.filter(a => a.shiftId && a.shiftId.businessId.equals(req.user.businessId));
    
    const reportData = [];
    for (const assignment of validAssignments) {
      const attendance = await Attendance.findOne({ shiftAssignmentId: assignment._id });
      let hoursWorked = 0;
      if (attendance && attendance.clockOut && attendance.clockIn) {
        hoursWorked = (attendance.clockOut - attendance.clockIn) / (1000 * 60 * 60);
      }
      reportData.push({
        Employee: assignment.userId?.fullName || 'Unknown',
        Date: assignment.shiftId.shiftDate.toISOString().split('T')[0],
        Late: attendance?.isLate ? 'Yes' : 'No',
        HoursWorked: hoursWorked.toFixed(2)
      });
    }

    const parser = new Parser();
    const csv = parser.parse(reportData);

    res.header('Content-Type', 'text/csv');
    res.attachment('attendance-report.csv');
    return res.send(csv);
  } catch (error) {
    next(error);
  }
};
