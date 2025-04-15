import pool from "../config/exports.js";

export const createOrganization = async (name, description, userId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Создаем организацию
    const organizationResult = await client.query(
      `INSERT INTO warehouse_management.organizations (name, description, creator_id) 
       VALUES ($1, $2, $3) 
       RETURNING id`,
      [name, description, userId]
    );
    const organizationId = organizationResult.rows[0].id;

    // Создаем связь пользователя с организацией как создателя
    await client.query(
      `INSERT INTO warehouse_management.user_organization_roles (organization_id, user_id, role) 
       VALUES ($1, $2, 'creator')`,
      [organizationId, userId]
    );

    await client.query('COMMIT');
    return organizationId;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const getUserOrganization = async (userId) => {
  const result = await pool.query(
    `SELECT o.*, 
            COUNT(DISTINCT w.id) as warehouses_count,
            COUNT(DISTINCT uor.user_id) as members_count
     FROM warehouse_management.organizations o
     JOIN warehouse_management.user_organization_roles uor ON o.id = uor.organization_id
     LEFT JOIN warehouse_management.warehouses w ON o.id = w.organization_id
     WHERE uor.user_id = $1
     GROUP BY o.id`,
    [userId]
  );
  return result.rows[0] || null;
}; 