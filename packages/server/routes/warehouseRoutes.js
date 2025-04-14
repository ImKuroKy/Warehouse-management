import express from "express";
import { getWarehouse, getWarehouseProducts } from "../controllers/warehouseController.js";
import authenticateJWT from "../middleware/authenticateJWT.js";

const router = express.Router();

router.get("/:id/products", authenticateJWT, getWarehouseProducts);
router.get("/:id", authenticateJWT, getWarehouse);
export default router;