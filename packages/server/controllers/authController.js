import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { validationResult } from "express-validator";
import { findUserByEmail, createUser } from "../models/authModel.js";
import { sendVerificationEmail } from "../middleware/emailVerification.js";
import { generateVerificationToken } from "../middleware/generateToken.js";

dotenv.config();
const secretKey = process.env.SECRET_KEY;
export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, password } = req.body;
    
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 часа

    await createUser(
      username,
      email,
      hashedPassword,
      verificationToken,
      tokenExpiresAt
    );

    await sendVerificationEmail(email, username, verificationToken);

    res.status(201).json({
      success: true,
      message:
        "Пользователь зарегистрирован. Проверьте email для подтверждения.",
    });
  } catch (err) {
    console.error("Error inserting user: ", err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    if (!user.is_verified) {
      return res.status(403).send("Аккаунт не активирован. Подтвердите email.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid email or password");
    }

    const token = jwt.sign({ userId: user.id }, secretKey, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (err) {
    console.error("Error fetching user: ", err);
    res.status(500).send("Internal server error");
  }
};
