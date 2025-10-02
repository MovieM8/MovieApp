import { addGroupMessage, getGroupMessages, deleteGroupMessage } from "../models/GroupChat.js";
import { ApiError } from "../helper/ApiError.js";

// Add a chat message
const createMessage = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { groupId, msg } = req.body;
        if (!userId) return next(new ApiError("User not authenticated", 401));
        if (!groupId || !msg) return next(new ApiError("groupId and msg are required", 400));

        const message = await addGroupMessage(userId, groupId, msg);
        res.status(201).json(message);
    } catch (err) {
        next(err);
    }
};

// Get all messages by group
const listMessagesByGroup = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { groupId } = req.params;
        if (!userId) return next(new ApiError("User not authenticated", 401));

        const messages = await getGroupMessages(userId, groupId);
        res.status(200).json(messages || []);
    } catch (err) {
        next(err);
    }
};

// Delete a message
const removeMessage = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { messageId } = req.params;
        if (!userId) return next(new ApiError("User not authenticated", 401));

        const deleted = await deleteGroupMessage(userId, messageId);
        if (!deleted) return next(new ApiError("Message not found", 404));

        res.status(200).json({ message: "Message deleted", deleted });
    } catch (err) {
        next(err);
    }
};

export { createMessage, listMessagesByGroup, removeMessage };
