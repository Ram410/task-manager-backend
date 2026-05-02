import express from "express";
import { createProject, getProjects, deleteProject, getProjectById } from "../controllers/projectController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import checkRole from "../middleware/roleMiddleware.js";

const router = express.Router();

console.log("Project routes loaded");

router.post("/create", authMiddleware, createProject);
router.get("/all", authMiddleware, getProjects);
router.get("/:id", authMiddleware, getProjectById);
router.delete("/:id", authMiddleware, checkRole("admin"), deleteProject);

export default router;