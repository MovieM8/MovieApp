import { Router } from "express";
import { auth } from "../helper/auth.js";
import { createMessage, listMessagesByGroup, removeMessage } from "../controllers/GroupChatController.js";

const router = Router();

// Add message to group chat
router.post("/", auth, createMessage);

// Get all messages for a group (latest first)
router.get("/group/:groupId", auth, listMessagesByGroup);

// Delete a message
router.delete("/:messageId", auth, removeMessage);

export default router;
