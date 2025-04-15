import express from "express";
import { organizationValidation } from "../validators/organizationValidators.js";
import { createOrganizationHandler, getUserOrganizationHandler } from "../controllers/organizationController.js";
import authenticateJWT from "../middleware/authenticateJWT.js";

const router = express.Router();

router.post("/", authenticateJWT, organizationValidation, createOrganizationHandler);
router.get("/user", authenticateJWT, getUserOrganizationHandler);

export default router; 