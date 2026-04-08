import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  shiftAssignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShiftAssignment',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clockIn: {
    type: Date,
    default: null
  },
  clockOut: {
    type: Date,
    default: null
  },
  isLate: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Attendance', attendanceSchema);
