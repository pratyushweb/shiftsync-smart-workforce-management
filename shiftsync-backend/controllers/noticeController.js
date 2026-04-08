import Notice from '../models/Notice.js';
import { getIO } from '../config/socket.js';


export const createNotice = async (req, res, next) => {
  const { content } = req.body;

  try {
    const notice = await Notice.create({
      businessId: req.user.businessId,
      content,
      postedBy: req.user._id
    });

    getIO().emit('notice_posted', { notice });


    res.status(201).json({ success: true, data: notice });
  } catch (error) {
    next(error);
  }
};
