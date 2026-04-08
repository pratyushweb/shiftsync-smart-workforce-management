import { v4 as uuidv4 } from 'uuid';
import InviteToken from '../models/InviteToken.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/email.js';

export const sendInvite = async (req, res, next) => {
  const { email } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

    await InviteToken.create({
      email,
      businessId: req.user.businessId,
      token,
      expiresAt
    });

    const inviteUrl = `${process.env.FRONTEND_URL}/invite/${token}`;

    // Email is best-effort - don't crash if SMTP is not configured
    const emailResult = await sendEmail({
      to: email,
      subject: 'You have been invited to ShiftSync',
      text: `Join your team on ShiftSync! Click here to set up your account: ${inviteUrl}`,
      html: `<p>Join your team on ShiftSync!</p><p><a href="${inviteUrl}">Click here to set up your account</a></p>`
    });

    const message = emailResult.success
      ? 'Invite sent successfully'
      : `Invite created (email delivery failed - share this link manually: ${inviteUrl})`;

    res.status(200).json({ success: true, message, inviteUrl });
  } catch (error) {
    next(error);
  }
};

export const employeeSignup = async (req, res, next) => {
  const { token, password, fullName } = req.body;

  try {
    const invite = await InviteToken.findOne({ token, expiresAt: { $gt: Date.now() } });
    
    if (!invite) {
      return res.status(400).json({ success: false, message: 'Invalid or expired invite token' });
    }

    const user = await User.create({
      email: invite.email,
      password,
      fullName,
      role: 'employee',
      businessId: invite.businessId
    });

    // Clean up
    await InviteToken.deleteOne({ _id: invite._id });

    res.status(201).json({ success: true, message: 'Account created successfully. Please login.' });
  } catch (error) {
    next(error);
  }
};
