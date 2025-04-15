import pool from "../config/exports.js";

export const getOrganizationUsers = async (organizationId) => {
  const result = await pool.query(
    `SELECT u.id, u.username, u.email, uor.role
     FROM warehouse_management.users u
     JOIN warehouse_management.user_organization_roles uor ON u.id = uor.user_id
     WHERE uor.organization_id = $1
     ORDER BY 
       CASE uor.role 
         WHEN 'creator' THEN 1
         WHEN 'admin' THEN 2
         ELSE 3
       END,
       u.username`,
    [organizationId]
  );
  return result.rows;
};

export const searchUsers = async (searchTerm) => {
  const result = await pool.query(
    `SELECT id, username, email
     FROM warehouse_management.users
     WHERE username ILIKE $1 OR email ILIKE $1
     LIMIT 10`,
    [`%${searchTerm}%`]
  );
  return result.rows;
};

export const inviteUser = async (organizationId, userId, invitedBy) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Проверяем, не является ли пользователь уже участником
    const existingMember = await client.query(
      `SELECT 1 FROM warehouse_management.user_organization_roles
       WHERE organization_id = $1 AND user_id = $2`,
      [organizationId, userId]
    );

    if (existingMember.rows.length > 0) {
      throw new Error('User is already a member of this organization');
    }

    // Создаем приглашение
    await client.query(
      `INSERT INTO warehouse_management.organization_invitations 
       (organization_id, user_id, invited_by, status)
       VALUES ($1, $2, $3, 'pending')`,
      [organizationId, userId, invitedBy]
    );

    await client.query('COMMIT');
    return true;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const updateUserRole = async (organizationId, userId, newRole) => {
  const result = await pool.query(
    `UPDATE warehouse_management.user_organization_roles
     SET role = $1
     WHERE organization_id = $2 AND user_id = $3
     RETURNING *`,
    [newRole, organizationId, userId]
  );
  return result.rows[0];
};

export const removeUser = async (organizationId, userId) => {
  const result = await pool.query(
    `DELETE FROM warehouse_management.user_organization_roles
     WHERE organization_id = $1 AND user_id = $2
     RETURNING *`,
    [organizationId, userId]
  );
  return result.rows[0];
};

export const getCurrentUserRole = async (organizationId, userId) => {
  const result = await pool.query(
    `SELECT role
     FROM warehouse_management.user_organization_roles
     WHERE organization_id = $1 AND user_id = $2`,
    [organizationId, userId]
  );
  return result.rows[0]?.role || null;
};

export const getCurrentOrganizationUsers = async (userId) => {
  const result = await pool.query(
    `SELECT u.id, u.username as name, u.email, uor.role
     FROM warehouse_management.users u
     JOIN warehouse_management.user_organization_roles uor ON u.id = uor.user_id
     WHERE u.id = $1
     ORDER BY 
       CASE uor.role 
         WHEN 'creator' THEN 1
         WHEN 'admin' THEN 2
         ELSE 3
       END,
       u.username`,
    [userId]
  );
  return result.rows;
}; 