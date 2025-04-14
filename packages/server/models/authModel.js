import pool from "../config/exports.js";

export const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM "warehouse_management"."users" WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

export const createUser = async (
  username,
  email,
  hashedPassword,
  verificationToken,
  tokenExpiresAt
) => {
  const query = `
    INSERT INTO "warehouse_management"."users" 
    (username, email, password_hash, verification_token, verification_token_expires_at) 
    VALUES ($1, $2, $3, $4, $5) RETURNING id
  `;
  const values = [
    username,
    email,
    hashedPassword,
    verificationToken,
    tokenExpiresAt,
  ];
  const result = await pool.query(query, values);
  return result.rows[0].id;
};
