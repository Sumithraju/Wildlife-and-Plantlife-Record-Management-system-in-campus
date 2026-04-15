const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const UserModel = {
  async create({ full_name, email, password, role = 'viewer' }) {
    const password_hash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, full_name, email, role, is_active, created_at`,
      [full_name, email, password_hash, role]
    );
    return rows[0];
  },

  async findByEmail(email) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );
    return rows[0];
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT id, full_name, email, role, is_active, created_at FROM users WHERE id = $1',
      [id]
    );
    return rows[0];
  },

  async findAll({ page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;
    const { rows } = await pool.query(
      `SELECT id, full_name, email, role, is_active, created_at
       FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    const count = await pool.query('SELECT COUNT(*) FROM users');
    return { users: rows, total: parseInt(count.rows[0].count) };
  },

  async updateRole(id, role) {
    const { rows } = await pool.query(
      `UPDATE users SET role = $1, updated_at = NOW()
       WHERE id = $2 RETURNING id, full_name, email, role`,
      [role, id]
    );
    return rows[0];
  },

  async deactivate(id) {
    const { rows } = await pool.query(
      `UPDATE users SET is_active = false, updated_at = NOW()
       WHERE id = $1 RETURNING id, email, is_active`,
      [id]
    );
    return rows[0];
  },

  async verifyPassword(plain, hash) {
    return bcrypt.compare(plain, hash);
  },
};

module.exports = UserModel;
