import SwapRequest from '../models/SwapRequest.js';
import ShiftAssignment from '../models/ShiftAssignment.js';
import Shift from '../models/Shift.js';
import { getIO } from '../config/socket.js';

import { sendEmail } from '../utils/email.js';

export const getSwaps = async (req, res, next) => {
  try {
    const swaps = await SwapRequest.find({
      $or: [
        { requesterId: req.user._id },
        { targetUserId: req.user._id }
      ]
    })
    .populate({
      path: 'shiftAssignmentId',
      populate: { path: 'shiftId' }
    })
    .sort({ createdAt: -1 });

    const mappedSwaps = swaps.map(swap => {
      const obj = swap.toObject();
      if (swap.shiftAssignmentId && swap.shiftAssignmentId.shiftId) {
        obj.shiftId = swap.shiftAssignmentId.shiftId._id || swap.shiftAssignmentId.shiftId;
      }
      return obj;
    });

    res.status(200).json({ success: true, data: mappedSwaps });
  } catch (error) {
    next(error);
  }
};

export const requestSwap = async (req, res, next) => {
  let { shiftAssignmentId, shiftId, targetUserId } = req.body;

  try {
    if (shiftId) {
      const mongoose = (await import('mongoose')).default;
      if (mongoose.Types.ObjectId.isValid(shiftId)) {
        let shiftObj = await Shift.findById(shiftId);
        if (!shiftObj) {
          let title = 'Morning Shift';
          let startTime = '08:00';
          let endTime = '16:00';
          if (shiftId.toString() === '6a1444c82c56829ffc605ac2') {
            title = 'Afternoon Shift';
            startTime = '16:00';
            endTime = '00:00';
          } else if (shiftId.toString() === '6a1444c82c56829ffc605ac5') {
            title = 'Night Shift';
            startTime = '00:00';
            endTime = '08:00';
          }

          await Shift.create({
            _id: shiftId,
            businessId: req.user.businessId,
            title,
            shiftDate: new Date(),
            startTime,
            endTime,
            role: req.user.jobTitle || 'Employee',
            createdBy: req.user._id
          });
        }
      }
    }

    // If shiftId is passed, find or create the corresponding assignment for this shift
    if (!shiftAssignmentId && shiftId) {
      let assignment = await ShiftAssignment.findOne({ shiftId });
      if (!assignment) {
        // Create an assignment if it doesn't exist
        assignment = await ShiftAssignment.create({
          shiftId,
          userId: req.user._id,
          status: 'assigned'
        });
      }
      shiftAssignmentId = assignment._id;
    }

    if (!shiftAssignmentId) {
      return res.status(400).json({ success: false, message: 'Shift assignment not found' });
    }

    const swap = await SwapRequest.create({
      shiftAssignmentId,
      requesterId: req.user._id,
      targetUserId,
      status: 'pending'
    });

    // Notify target user
    getIO().emit('swap_requested', { targetUserId, message: 'You have a new shift swap request' });

    const obj = swap.toObject();
    obj.shiftId = shiftId;

    res.status(201).json({ success: true, data: obj });
  } catch (error) {
    next(error);
  }
};

export const respondToSwap = async (req, res, next) => {
  const { swapId, response } = req.body; // response: 'accepted' or 'rejected'

  try {
    const swap = await SwapRequest.findOne({ _id: swapId, targetUserId: req.user._id });
    if (!swap) return res.status(404).json({ success: false, message: 'Swap request not found' });

    if (response === 'accepted') {
      swap.status = 'accepted';
      const assignment = await ShiftAssignment.findById(swap.shiftAssignmentId);
      if (assignment) {
        assignment.userId = swap.targetUserId;
        assignment.status = 'swapped';
        await assignment.save();
      }
    } else {
      swap.status = 'rejected';
    }

    await swap.save();

    getIO().emit('swap_updated', { requesterId: swap.requesterId, status: swap.status });

    res.status(200).json({ success: true, data: swap });
  } catch (error) {
    next(error);
  }
};

export const managerApproveSwap = async (req, res, next) => {
  const { swapId, approved } = req.body;

  try {
    const swap = await SwapRequest.findById(swapId).populate('shiftAssignmentId');
    if (!swap || swap.status !== 'accepted') {
      return res.status(400).json({ success: false, message: 'Invalid swap request state' });
    }

    swap.managerApproved = approved;
    swap.status = approved ? 'manager_approved' : 'manager_rejected';
    await swap.save();

    if (approved) {
      // Reassign shift
      const assignment = swap.shiftAssignmentId;
      assignment.userId = swap.targetUserId;
      assignment.status = 'swapped';
      await assignment.save();
    }

    getIO().emit('swap_updated', { requesterId: swap.requesterId, status: swap.status });


    res.status(200).json({ success: true, data: swap });
  } catch (error) {
    next(error);
  }
};
