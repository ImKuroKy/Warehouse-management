import express from "express";
import {
  userRegistrationValidation,
  userLoginValidation,
} from "../validators/authValidators.js";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", userRegistrationValidation, register);
router.post("/login", userLoginValidation, login);

export default router;
