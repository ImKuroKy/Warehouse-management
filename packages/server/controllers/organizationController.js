import { createOrganization, getUserOrganization } from "../models/organizationModel.js";

export const createOrganizationHandler = async (req, res) => {
  const userId = req.user.userId;
  const { name, description } = req.body;

  try {
    const organizationId = await createOrganization(name, description, userId);
    res.status(201).json({
      success: true,
      message: "Организация успешно создана",
      organizationId
    });
  } catch (err) {
    console.error("Error creating organization:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserOrganizationHandler = async (req, res) => {
  const userId = req.user.userId;

  try {
    const organization = await getUserOrganization(userId);
    res.status(200).json(organization);
  } catch (err) {
    console.error("Error fetching user organization:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}; 