import express from "express";
import { createTask, getTasks } from "../controllers/taskController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { updateTask } from "../controllers/taskController.js";

const router = express.Router();

router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getTasks);
router.put("/:id", authMiddleware, updateTask);
export default router;


