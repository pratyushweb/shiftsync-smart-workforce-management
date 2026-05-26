import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dayOfWeek: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  status: {
    type: String,
    enum: ['Available', 'Unavailable', 'Mornings', 'Afternoons'],
    required: true,
    default: 'Available'
  },
  startTime: {
    type: String, // HH:MM format
    default: '09:00'
  },
  endTime: {
    type: String, // HH:MM format
    default: '17:00'
  },
  isCustom: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Availability', availabilitySchema);
