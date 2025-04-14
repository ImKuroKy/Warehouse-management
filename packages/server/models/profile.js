import pool from "../config/exports.js";

export const checkUser = async (userId) => {
  const userCheckId =
    'SELECT * FROM "warehouse-management"."user_account" WHERE user_id = $1';
  const result = await pool.query(userCheckId, [userId]);
  return result.rows.length > 0;
};

export const getProfile = async (userId) => {
  const getQueryProfile = `SELECT ua.name, ua.email, ud.phone, ud.background_url, ud.avatar_url, ud.about
    FROM "warehouse-management"."user_account" ua
    LEFT JOIN "warehouse-management"."user_data" ud ON ua.user_id = ud.user_id
    WHERE ua.user_id = $1`;
  const result = await pool.query(getQueryProfile, [userId]);
  return result.rows[0];
};

export const updateProfile = async (
  name,
  email,
  phone,
  about,
  backgroundUrl,
  avatarUrl,
  addressId,
  userId
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const updateUserAccountQuery = `
      UPDATE "warehouse-management"."user_account" ua
      SET name = COALESCE($1, ua.name), email = COALESCE($2, ua.email)
      WHERE ua.user_id = $3;`;

    await client.query(updateUserAccountQuery, [name, email, userId]);

    const updateUserDataQuery = `
      UPDATE "warehouse-management"."user_data" ud
      SET phone = COALESCE($1, ud.phone),
          about = COALESCE($2, ud.about),
          background_url = COALESCE($3, ud.background_url),
          avatar_url = COALESCE($4, ud.avatar_url),
          address_id = COALESCE($5, ud.address_id)
      WHERE ud.user_id = $6;`;

    await client.query(updateUserDataQuery, [
      phone,
      about,
      backgroundUrl,
      avatarUrl,
      addressId,
      userId,
    ]);

    await client.query("COMMIT");

    return await getProfile(userId);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
