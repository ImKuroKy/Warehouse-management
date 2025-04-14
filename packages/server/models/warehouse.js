import pool from "../config/exports.js";

export const fetchWarehouseProducts = async (warehouseId) => {
  const query = `
    SELECT 
        p.name AS product_name,
        wp.quantity,
        p.sku,
        p.description,
        p.price,
        p.manufacturer,
        s.name AS supplier_name
    FROM 
        "warehouse-management".warehouse w
    JOIN 
        "warehouse-management".warehouse_product wp ON w.warehouse_id = wp.warehouse_id
    JOIN 
        "warehouse-management".product p ON wp.product_id = p.product_id
    LEFT JOIN 
        "warehouse-management".supplier s ON p.supplier_id = s.supplier_id
    WHERE 
        w.warehouse_id = $1;
  `;

  const result = await pool.query(query, [warehouseId]);

  return result.rows;
};

export const fetchWarehouseDetails = async (warehouseId) => {
  const query = `
    SELECT 
        w.name,
        CONCAT(wa.street, ', ', wa.city, ', ', wa.state, ', ', wa.postal_code, ', ', wa.country) AS address,
        w.max_capacity AS capacity
    FROM 
        "warehouse-management".warehouse w
    JOIN 
        "warehouse-management".warehouse_address wa ON w.address_id = wa.address_id
    WHERE 
        w.warehouse_id = $1;
  `;

  const result = await pool.query(query, [warehouseId]);

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};
