import express from "express";
import { getDashboard } from "../controllers/taskController.js";
import { createTask, getTasks } from "../controllers/taskController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { updateTask } from "../controllers/taskController.js";

const router = express.Router();
router.get("/dashboard", authMiddleware, getDashboard);
router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getTasks);
router.put("/:id", authMiddleware, updateTask);
export default router;


