import cron from 'node-cron';
import Shift from '../models/Shift.js';
import ShiftAssignment from '../models/ShiftAssignment.js';
import { sendEmail } from '../utils/email.js';

export const startCronJobs = () => {
  // Run every day at 7:00 AM
  cron.schedule('0 7 * * *', async () => {
    console.log('[Cron Job] Running daily shift reminder check...');
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      // Find all shifts happening today
      const todayShifts = await Shift.find({
        shiftDate: { $gte: today, $lt: tomorrow }
      });

      const shiftIds = todayShifts.map(s => s._id);

      const assignments = await ShiftAssignment.find({
        shiftId: { $in: shiftIds },
        status: { $in: ['assigned', 'published'] }
      }).populate('userId').populate('shiftId');

      // Send emails
      for (const assignment of assignments) {
        if (assignment.userId && assignment.userId.email) {
          await sendEmail({
            to: assignment.userId.email,
            subject: 'ShiftSync Reminder: You have a shift today',
            text: `Hi ${assignment.userId.fullName}, you have a shift today from ${assignment.shiftId.startTime} to ${assignment.shiftId.endTime}. Don't forget to clock in!`,
            html: `<p>Hi ${assignment.userId.fullName},</p><p>You have a shift today from <strong>${assignment.shiftId.startTime} to ${assignment.shiftId.endTime}</strong>.</p><p>Don't forget to clock in via ShiftSync!</p>`
          });
        }
      }
      
      console.log(`[Cron Job] Sent ${assignments.length} reminders.`);
    } catch (error) {
      console.error('[Cron Job] Error in daily reminders:', error);
    }
  });
};
