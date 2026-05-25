import mongoose from 'mongoose';

const shiftAssignmentSchema = new mongoose.Schema({
  shiftId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shift',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['assigned', 'published', 'completed', 'swapped'],
    default: 'assigned'
  }
}, {
  timestamps: true
});

export default mongoose.model('ShiftAssignment', shiftAssignmentSchema);
