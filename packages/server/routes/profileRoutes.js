import express from "express";
import {
  getUserProfile,
  editUserProfile,
} from "../controllers/profileController.js";
import upload from "../middleware/upload.js";
import authenticateJWT from "../middleware/authenticateJWT.js";

const router = express.Router();

router.get("/", authenticateJWT, getUserProfile);
router.post('/profile-edit', authenticateJWT, upload.fields([{ name: 'background' }, { name: 'avatar' }]), editUserProfile);
export default router;
