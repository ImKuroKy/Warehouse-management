import pool from "../config/exports.js";

export const findUserByToken = async (token) => {
  const result = await pool.query(
    `SELECT * FROM "warehouse_management"."users" 
     WHERE verification_token = $1 AND verification_token_expires_at > NOW()`,
    [token]
  );
  return result.rows[0];
};

export const confirmVerification = async (userId) => {
  await pool.query(
    `UPDATE "warehouse_management"."users" 
     SET is_verified = TRUE, verification_token = NULL, verification_token_expires_at = NULL 
     WHERE id = $1`,
    [userId]
  );
};