import { Router } from "express";
import {
    createGroupController,
    listGroups,
    getGroupDetails,
    deleteGroup,
    joinGroup,
    handleJoinRequest,
    removeGroupMember,
    addGroupMovie,
    addGroupScreening,
    listPendingRequests,
} from "../controllers/GroupController.js";
import { auth } from "../helper/auth.js";

const router = Router();

// Create group
router.post("/", auth, createGroupController);

// List all groups (public)
router.get("/", listGroups);

// Get group details (members only)
router.get("/:groupId", auth, getGroupDetails);

// Delete group (only owner)
router.delete("/:groupId", auth, deleteGroup);

// Request to join group
router.post("/:groupId/join", auth, joinGroup);

// List pending requests (only owner)
router.get("/:groupId/requests", auth, listPendingRequests);

// Approve/reject join (only owner)
router.post("/:groupId/requests/:userId", auth, handleJoinRequest);

// Remove member / leave group
router.delete("/:groupId/members/:userId", auth, removeGroupMember);

// Add movie to group
router.post("/:groupId/movie", auth, addGroupMovie);

// Add screening to group
router.post("/:groupId/screening", auth, addGroupScreening);

export default router;