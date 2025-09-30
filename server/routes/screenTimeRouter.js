import { Router } from "express";
import { auth } from "../helper/auth.js";
import { createScreenTime, deleteScreenTime, listScreenTimesByGroup } from "../controllers/ScreenTimeController.js";

const router = Router();

// Add a screening time to a group
router.post("/", auth, createScreenTime);

// Remove a screening time from a group
router.delete("/:groupTimeId", auth, deleteScreenTime);

// Get all screening times for a group (public or auth, depending on requirements)
router.get("/group/:groupId", auth, listScreenTimesByGroup);

export default router;
