

import express from "express";
import {
  createTask,
  getTasks,
  toggleTask
} from "../controllers/taskController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create a new task
// POST /api/tasks
router.post("/", authMiddleware, createTask);

// ✅ Get all tasks for a project
// GET /api/tasks/:projectId
router.get("/:projectId", authMiddleware, getTasks);

// ✅ Toggle task (mark complete/incomplete)
// PUT /api/tasks/:id
router.put("/:id", authMiddleware, toggleTask);

export default router;


