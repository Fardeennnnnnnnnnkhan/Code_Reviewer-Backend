import Code from "../models/code.model.js";
import Activity from "../models/activity.model.js";
import { calculateStreak } from "../utils/streakCalculator.js";

// GET /api/user-progress/:userId
export const getUserProgress = async (req, res) => {
    try {
        const { userId } = req.params;
        const history = await Code.find({ userId }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, progress: history });
    } catch (error) {
        console.error("Error fetching user progress:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// GET /api/activity/:userId
export const getUserActivity = async (req, res) => {
    try {
        const { userId } = req.params;
        const activities = await Activity.find({ userId }).sort({ date: 1 });
        return res.status(200).json({ success: true, activities });
    } catch (error) {
        console.error("Error fetching user activities:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// GET /api/streak/:userId
export const getUserStreak = async (req, res) => {
    try {
        const { userId } = req.params;
        const activities = await Activity.find({ userId });
        const { currentStreak, longestStreak } = calculateStreak(activities);
        return res.status(200).json({ 
            success: true, 
            currentStreak, 
            longestStreak 
        });
    } catch (error) {
        console.error("Error fetching user streak:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
