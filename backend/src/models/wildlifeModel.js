const pool = require('../config/db');

const WildlifeModel = {
  async create({ user_id, species_name, common_name, category, observation_date, latitude, longitude, habitat, notes }) {
    const { rows } = await pool.query(
      `INSERT INTO wildlife_records
         (user_id, species_name, common_name, category, observation_date, latitude, longitude, habitat, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [user_id, species_name, common_name, category, observation_date, latitude, longitude, habitat, notes]
    );
    return rows[0];
  },

  async findAll({ page = 1, limit = 20, search, category, status, date_from, date_to }) {
    const params = [];
    const conditions = [];
    let idx = 1;

    if (search) {
      conditions.push(`(species_name ILIKE $${idx} OR common_name ILIKE $${idx})`);
      params.push(`%${search}%`);
      idx++;
    }
    if (category) { conditions.push(`category = $${idx++}`); params.push(category); }
    if (status)   { conditions.push(`status = $${idx++}`);   params.push(status); }
    if (date_from){ conditions.push(`observation_date >= $${idx++}`); params.push(date_from); }
    if (date_to)  { conditions.push(`observation_date <= $${idx++}`); params.push(date_to); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (page - 1) * limit;

    const data = await pool.query(
      `SELECT w.*, u.full_name AS observer_name
       FROM wildlife_records w
       JOIN users u ON u.id = w.user_id
       ${where}
       ORDER BY w.observation_date DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    );

    const count = await pool.query(
      `SELECT COUNT(*) FROM wildlife_records ${where}`,
      params
    );

    return { records: data.rows, total: parseInt(count.rows[0].count) };
  },

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT w.*, u.full_name AS observer_name,
              json_agg(ri.image_url) FILTER (WHERE ri.id IS NOT NULL) AS images
       FROM wildlife_records w
       JOIN users u ON u.id = w.user_id
       LEFT JOIN record_images ri ON ri.record_id = w.id AND ri.record_type = 'wildlife'
       WHERE w.id = $1
       GROUP BY w.id, u.full_name`,
      [id]
    );
    return rows[0];
  },

  async update(id, { species_name, common_name, category, observation_date, latitude, longitude, habitat, notes }) {
    const { rows } = await pool.query(
      `UPDATE wildlife_records SET
         species_name=$1, common_name=$2, category=$3, observation_date=$4,
         latitude=$5, longitude=$6, habitat=$7, notes=$8, updated_at=NOW()
       WHERE id=$9 RETURNING *`,
      [species_name, common_name, category, observation_date, latitude, longitude, habitat, notes, id]
    );
    return rows[0];
  },

  async updateStatus(id, status) {
    const { rows } = await pool.query(
      `UPDATE wildlife_records SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *`,
      [status, id]
    );
    return rows[0];
  },

  async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM wildlife_records WHERE id=$1 RETURNING id',
      [id]
    );
    return rows[0];
  },

  async countByCategory() {
    const { rows } = await pool.query(
      `SELECT category, COUNT(*) AS count FROM wildlife_records GROUP BY category ORDER BY count DESC`
    );
    return rows;
  },

  async monthlyTrend() {
    const { rows } = await pool.query(
      `SELECT TO_CHAR(observation_date,'YYYY-MM') AS month, COUNT(*) AS count
       FROM wildlife_records
       WHERE observation_date >= NOW() - INTERVAL '12 months'
       GROUP BY month ORDER BY month`
    );
    return rows;
  },
};

module.exports = WildlifeModel;
