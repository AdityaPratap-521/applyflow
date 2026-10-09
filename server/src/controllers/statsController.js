import { Application } from '../models/Application.js';

export const getStats = async (req, res, next) => {
  try {
    const now = new Date();

    const [
      totalApplications,
      appliedCount,
      interviewCount,
      offerCount,
      rejectedCount,
      upcomingInterviews,
      overdueFollowUps,
    ] = await Promise.all([
      Application.countDocuments(),
      Application.countDocuments({ status: 'Applied' }),
      Application.countDocuments({ status: 'Interview' }),
      Application.countDocuments({ status: 'Offer' }),
      Application.countDocuments({ status: 'Rejected' }),
      Application.countDocuments({
        interviewDate: { $gte: now },
        status: { $ne: 'Rejected' },
      }),
      Application.countDocuments({
        followUpDate: { $lt: now },
        status: { $in: ['Applied', 'Interview'] },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalApplications,
        byStatus: {
          Applied: appliedCount,
          Interview: interviewCount,
          Offer: offerCount,
          Rejected: rejectedCount,
        },
        upcomingInterviews,
        offers: offerCount,
        overdueFollowUps,
      },
    });
  } catch (error) {
    next(error);
  }
};
