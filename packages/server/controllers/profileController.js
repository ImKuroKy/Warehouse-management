import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { checkUser, getProfile, updateProfile } from "../models/profile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getUserProfile = async (req, res) => {
  const userId = req.user.userId;

  try {
    const userExists = await checkUser(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = await getProfile(userId);
    
    res.status(200).json({
      data: userProfile,
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editUserProfile = async (req, res) => {
  const userId = req.user.userId;
  const { name, email, phone, about } = req.body;
  const addressId = userId;
  let backgroundUrl, avatarUrl;

  try {
    const userExists = await checkUser(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentProfile = await getProfile(userId);

    if (req.files) {
      if (req.files.background) {
        const backgroundFilename = req.files.background[0].filename;
        backgroundUrl = `${req.protocol}://${req.get('host')}/uploads/${backgroundFilename}`;
      }

      if (req.files.avatar) {
        const avatarFilename = req.files.avatar[0].filename;
        avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${avatarFilename}`;
      }
    }

    await updateProfile(
      name,
      email,
      phone,
      about,
      backgroundUrl,
      avatarUrl,
      addressId,
      userId
    );

    if (req.files) {
      if (req.files.background && currentProfile.background_url) {
        const oldBackgroundPath = path.join(__dirname, '../..', currentProfile.background_url.replace(`${req.protocol}://${req.get('host')}/`, ''));
        await fs.unlink(oldBackgroundPath);
      }

      if (req.files.avatar && currentProfile.avatar_url) {
        const oldAvatarPath = path.join(__dirname, '../..', currentProfile.avatar_url.replace(`${req.protocol}://${req.get('host')}/`, ''));
        await fs.unlink(oldAvatarPath);
      }
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully"
    });
  } catch (err) {
    console.error("Error updating user profile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
