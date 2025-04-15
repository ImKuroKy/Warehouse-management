import { 
  getOrganizationUsers, 
  searchUsers, 
  inviteUser, 
  updateUserRole, 
  removeUser,
  getCurrentUserRole,
  getCurrentOrganizationUsers
} from "../models/organizationUsersModel.js";

export const getOrganizationUsersHandler = async (req, res) => {
  const organizationId = req.params.organizationId;
  const userId = req.user.userId;

  try {
    const users = await getOrganizationUsers(organizationId);
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching organization users:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const searchUsersHandler = async (req, res) => {
  const { searchTerm } = req.query;

  try {
    const users = await searchUsers(searchTerm);
    res.status(200).json(users);
  } catch (err) {
    console.error("Error searching users:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const inviteUserHandler = async (req, res) => {
  const { organizationId } = req.params;
  const { nickname } = req.body;
  const invitedBy = req.user.userId;

  try {
    await inviteUser(organizationId, nickname, invitedBy);
    res.status(200).json({ message: "User invited successfully" });
  } catch (error) {
    console.error("Error inviting user:", error);
    if (error.message === 'User not found') {
      res.status(404).json({ error: "User not found" });
    } else if (error.message === 'User is already a member of this organization') {
      res.status(400).json({ error: "User is already a member of this organization" });
    } else {
      res.status(500).json({ error: "Failed to invite user" });
    }
  }
};

export const updateUserRoleHandler = async (req, res) => {
  const organizationId = req.params.organizationId;
  const { userId, newRole } = req.body;

  try {
    const updatedRole = await updateUserRole(organizationId, userId, newRole);
    res.status(200).json(updatedRole);
  } catch (err) {
    console.error("Error updating user role:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeUserHandler = async (req, res) => {
  const organizationId = req.params.organizationId;
  const { userId } = req.body;

  try {
    await removeUser(organizationId, userId);
    res.status(200).json({ 
      success: true, 
      message: "Пользователь удален из организации" 
    });
  } catch (err) {
    console.error("Error removing user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCurrentUserRoleHandler = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const userId = req.user.userId;

    const role = await getCurrentUserRole(organizationId, userId);
    if (!role) {
      return res.status(404).json({ message: "User role not found" });
    }

    res.json(role);
  } catch (error) {
    console.error("Error getting current user role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCurrentOrganizationUsersHandler = async (req, res) => {
  try {
    const userId = req.user.userId;
    const users = await getCurrentOrganizationUsers(userId);
    res.json(users);
  } catch (error) {
    console.error("Error getting current organization users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}; 