import express from "express";
import { createProject, getProjects } from "../controllers/projectController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
console.log("Project routes loaded");
router.post("/create", authMiddleware, createProject);
router.get("/all", authMiddleware, getProjects);

export default router;
