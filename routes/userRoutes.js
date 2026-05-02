import express from "express";
import { getAllUsers, updateUserRole } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import checkRole from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/all", authMiddleware, checkRole("admin"), getAllUsers);
router.put("/role", authMiddleware, checkRole("admin"), updateUserRole);

export default router;