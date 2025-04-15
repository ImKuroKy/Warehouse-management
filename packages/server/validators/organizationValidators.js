import { body } from "express-validator";

export const organizationValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Название организации обязательно")
    .isLength({ min: 3, max: 100 })
    .withMessage("Название должно быть от 3 до 100 символов")
    .matches(/^[a-zA-Zа-яА-Я0-9\s\-_]+$/)
    .withMessage("Название может содержать только буквы, цифры, пробелы, дефисы и подчеркивания"),
  
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Описание не должно превышать 500 символов")
]; 