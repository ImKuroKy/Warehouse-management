import express from "express";
import { 
  getOrganizationUsersHandler,
  searchUsersHandler,
  inviteUserHandler,
  updateUserRoleHandler,
  removeUserHandler,
  getCurrentUserRoleHandler,
  getCurrentOrganizationUsersHandler
} from "../controllers/organizationUsersController.js";
import authenticateJWT from "../middleware/authenticateJWT.js";

const router = express.Router();

router.get("/current/users", authenticateJWT, getCurrentOrganizationUsersHandler);
router.get("/:organizationId/users", authenticateJWT, getOrganizationUsersHandler);
router.get("/:organizationId/users/me", authenticateJWT, getCurrentUserRoleHandler);
router.get("/search", authenticateJWT, searchUsersHandler);
router.post("/:organizationId/users/invite", authenticateJWT, inviteUserHandler);
router.post("/:organizationId/users/:userId/promote", authenticateJWT, updateUserRoleHandler);
router.post("/:organizationId/users/:userId/demote", authenticateJWT, updateUserRoleHandler);
router.delete("/:organizationId/users/:userId", authenticateJWT, removeUserHandler);

export default router; 