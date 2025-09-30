import {
    addScreenTimeToGroup,
    removeScreenTimeFromGroup,
    getScreenTimesByGroup
} from "../models/ScreenTime.js";
import { ApiError } from "../helper/ApiError.js";

// Add screening time to a group
const createScreenTime = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) return next(new ApiError("User not authenticated", 401));

        const { groupId, screen } = req.body;
        if (!groupId || !screen) return next(new ApiError("groupId and screen data are required", 400));

        const added = await addScreenTimeToGroup(userId, groupId, screen);
        res.status(201).json(added);
    } catch (err) {
        next(err);
    }
};

// Remove screening time from a group
const deleteScreenTime = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { groupTimeId } = req.params;

        const deleted = await removeScreenTimeFromGroup(userId, groupTimeId);
        if (!deleted) return next(new ApiError("Screening time not found or unauthorized", 404));

        res.status(200).json({ message: "Screening time removed from group", deleted });
    } catch (err) {
        next(err);
    }
};

// Get all screening times for a group
const listScreenTimesByGroup = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const times = await getScreenTimesByGroup(groupId);
        res.status(200).json(times);
    } catch (err) {
        next(err);
    }
};

export { createScreenTime, deleteScreenTime, listScreenTimesByGroup };
