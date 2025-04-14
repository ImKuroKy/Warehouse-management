import { fetchWarehouseProducts, fetchWarehouseDetails } from "../models/warehouse.js";

export const getWarehouseProducts = async (req, res) => {
  const warehouseId = req.params.id;

  try {
    const products = await fetchWarehouseProducts(warehouseId);

    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching warehouse products:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getWarehouse = async (req, res) => {
  const warehouseId = req.params.id;

  try {
    const warehouseDetails = await fetchWarehouseDetails(warehouseId);

    if (!warehouseDetails) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    res.status(200).json(warehouseDetails);
  } catch (err) {
    console.error("Error fetching warehouse details:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};