import { getAdminStats } from "../services/adminStatsService.js";

export const getAdminStatsController = async (req, res, next) => {
  try {
    const stats = await getAdminStats();
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};
