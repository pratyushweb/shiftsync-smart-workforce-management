import mongoose from 'mongoose';

const swapRequestSchema = new mongoose.Schema({
  shiftAssignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShiftAssignment',
    required: true
  },
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'manager_approved', 'manager_rejected'],
    default: 'pending'
  },
  managerApproved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('SwapRequest', swapRequestSchema);
