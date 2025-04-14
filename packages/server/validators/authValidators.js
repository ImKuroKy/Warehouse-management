import { body } from "express-validator";

// Валидация для регистрации
export const userRegistrationValidation = [
  body("username").isLength({ min: 3 }).withMessage("Логин должен содержать минимум 3 символа"),
  body("email").isEmail().withMessage("Некорректный адрес электронной почты"),
  body("password").isLength({ min: 6 }).withMessage("Пароль должен содержать минимум 6 символов"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Пароли не совпадают");
    }
    return true;
  }),
];

// Валидация для входа
export const userLoginValidation = [
  body("email").notEmpty().withMessage("Email обязателен"), 
  body("password").notEmpty().withMessage("Пароль обязателен"),
];

// Валидация для повторной отправки письма
export const resendVerificationValidation = [
  body("email").isEmail().withMessage("Некорректный адрес электронной почты"),
];