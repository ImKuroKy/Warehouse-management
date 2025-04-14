import express from "express";
import { findUserByToken, confirmVerification } from "../models/verifyModel.js";

const router = express.Router();

router.get("/verify", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send("Токен не предоставлен");
  }

  try {
    const user = await findUserByToken(token);

    if (!user) {
      return res.status(400).send("Неверный или просроченный токен");
    }

    await confirmVerification(user.id);

    res.send("Email успешно подтверждён! Теперь вы можете войти в систему.");
  } catch (error) {
    console.error("Ошибка при верификации:", error);
    res.status(500).send("Ошибка сервера");
  }
});

export default router;