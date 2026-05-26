import LeaveRequest from '../models/LeaveRequest.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/email.js';

export const requestLeave = async (req, res, next) => {
  const { startDate, endDate, reason } = req.body;

  try {
    const leave = await LeaveRequest.create({
      userId: req.user._id,
      startDate,
      endDate,
      reason
    });

    res.status(201).json({ success: true, data: leave });
  } catch (error) {
    next(error);
  }
};

export const handleLeaveRequest = async (req, res, next) => {
  const { leaveId, status, managerComment } = req.body; // status: 'approved' or 'rejected'

  try {
    const leave = await LeaveRequest.findById(leaveId).populate('userId');
    if (!leave) return res.status(404).json({ success: false, message: 'Leave request not found' });

    leave.status = status;
    leave.managerComment = managerComment || '';
    await leave.save();

    await sendEmail({
      to: leave.userId.email,
      subject: `Leave Request ${status.toUpperCase()}`,
      text: `Your leave request from ${leave.startDate.toDateString()} to ${leave.endDate.toDateString()} has been ${status}. Notes: ${managerComment}`
    });

    res.status(200).json({ success: true, data: leave });
  } catch (error) {
    next(error);
  }
};

export const getLeaves = async (req, res, next) => {
  try {
    if (req.user.role === 'manager') {
      const usersInBusiness = await User.find({ businessId: req.user.businessId }).select('_id');
      const userIds = usersInBusiness.map(u => u._id);

      const leaves = await LeaveRequest.find({ userId: { $in: userIds } })
        .populate('userId', 'fullName email jobTitle')
        .sort({ createdAt: -1 });

      res.status(200).json({ success: true, data: leaves });
    } else {
      const leaves = await LeaveRequest.find({ userId: req.user._id })
        .populate('userId', 'fullName email jobTitle')
        .sort({ createdAt: -1 });

      res.status(200).json({ success: true, data: leaves });
    }
  } catch (error) {
    next(error);
  }
};
