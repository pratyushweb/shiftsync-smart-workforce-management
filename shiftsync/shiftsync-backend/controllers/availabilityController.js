import Availability from '../models/Availability.js';

// Retrieve availability for the logged-in user
export const getAvailability = async (req, res, next) => {
  try {
    const availabilities = await Availability.find({ userId: req.user._id }).sort({ createdAt: 1 });

    if (availabilities.length === 0) {
      // Return default starter weekly schedule if none is defined in database
      const defaultWeekly = [
        { name: 'Monday', status: 'Available', start: '09:00', end: '17:00', isCustom: false },
        { name: 'Tuesday', status: 'Available', start: '09:00', end: '17:00', isCustom: false },
        { name: 'Wednesday', status: 'Available', start: '09:00', end: '17:00', isCustom: false },
        { name: 'Thursday', status: 'Mornings', start: '09:00', end: '12:00', isCustom: false },
        { name: 'Friday', status: 'Available', start: '09:00', end: '17:00', isCustom: false },
        { name: 'Saturday', status: 'Unavailable', start: '-', end: '-', isCustom: false },
        { name: 'Sunday', status: 'Unavailable', start: '-', end: '-', isCustom: false },
      ];
      return res.status(200).json({ success: true, data: defaultWeekly });
    }

    // Map database model names to frontend properties
    const mappedAvailability = availabilities.map(av => ({
      id: av._id.toString(),
      name: av.dayOfWeek,
      status: av.status,
      start: av.startTime,
      end: av.endTime,
      isCustom: av.isCustom
    }));

    res.status(200).json({ success: true, data: mappedAvailability });
  } catch (error) {
    next(error);
  }
};

// Batch update/save all availability rules for the logged-in user
export const saveAvailability = async (req, res, next) => {
  const { availabilityList } = req.body;

  if (!Array.isArray(availabilityList)) {
    return res.status(400).json({ success: false, message: 'Invalid data: availabilityList must be an array' });
  }

  try {
    // Delete existing availability rules to perform clean ups and insert atomically
    await Availability.deleteMany({ userId: req.user._id });

    // Map frontend properties back to database model attributes
    const toInsert = availabilityList.map(item => ({
      userId: req.user._id,
      dayOfWeek: item.name,
      status: item.status,
      startTime: item.start || '-',
      endTime: item.end || '-',
      isCustom: item.isCustom || false
    }));

    const inserted = await Availability.insertMany(toInsert);

    // Map back for the frontend response
    const responseData = inserted.map(av => ({
      id: av._id.toString(),
      name: av.dayOfWeek,
      status: av.status,
      start: av.startTime,
      end: av.endTime,
      isCustom: av.isCustom
    }));

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    next(error);
  }
};
