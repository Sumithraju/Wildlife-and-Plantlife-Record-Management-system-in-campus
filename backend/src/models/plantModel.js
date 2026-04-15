const pool = require('../config/db');

const PlantModel = {
  async create({ user_id, species_name, family, common_name, flowering_season, height_cm, iucn_status, observation_date, latitude, longitude, notes }) {
    const { rows } = await pool.query(
      `INSERT INTO plant_records
         (user_id, species_name, family, common_name, flowering_season, height_cm, iucn_status, observation_date, latitude, longitude, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [user_id, species_name, family, common_name, flowering_season, height_cm, iucn_status, observation_date, latitude, longitude, notes]
    );
    return rows[0];
  },

  async findAll({ page = 1, limit = 20, search, status, date_from, date_to }) {
    const params = [];
    const conditions = [];
    let idx = 1;

    if (search) {
      conditions.push(`(species_name ILIKE $${idx} OR common_name ILIKE $${idx} OR family ILIKE $${idx})`);
      params.push(`%${search}%`);
      idx++;
    }
    if (status)   { conditions.push(`status = $${idx++}`);   params.push(status); }
    if (date_from){ conditions.push(`observation_date >= $${idx++}`); params.push(date_from); }
    if (date_to)  { conditions.push(`observation_date <= $${idx++}`); params.push(date_to); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (page - 1) * limit;

    const data = await pool.query(
      `SELECT p.*, u.full_name AS observer_name
       FROM plant_records p
       JOIN users u ON u.id = p.user_id
       ${where}
       ORDER BY p.observation_date DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    );

    const count = await pool.query(
      `SELECT COUNT(*) FROM plant_records ${where}`,
      params
    );

    return { records: data.rows, total: parseInt(count.rows[0].count) };
  },

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT p.*, u.full_name AS observer_name,
              json_agg(ri.image_url) FILTER (WHERE ri.id IS NOT NULL) AS images
       FROM plant_records p
       JOIN users u ON u.id = p.user_id
       LEFT JOIN record_images ri ON ri.record_id = p.id AND ri.record_type = 'plant'
       WHERE p.id = $1
       GROUP BY p.id, u.full_name`,
      [id]
    );
    return rows[0];
  },

  async update(id, { species_name, family, common_name, flowering_season, height_cm, iucn_status, observation_date, latitude, longitude, notes }) {
    const { rows } = await pool.query(
      `UPDATE plant_records SET
         species_name=$1, family=$2, common_name=$3, flowering_season=$4,
         height_cm=$5, iucn_status=$6, observation_date=$7,
         latitude=$8, longitude=$9, notes=$10, updated_at=NOW()
       WHERE id=$11 RETURNING *`,
      [species_name, family, common_name, flowering_season, height_cm, iucn_status, observation_date, latitude, longitude, notes, id]
    );
    return rows[0];
  },

  async updateStatus(id, status) {
    const { rows } = await pool.query(
      `UPDATE plant_records SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *`,
      [status, id]
    );
    return rows[0];
  },

  async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM plant_records WHERE id=$1 RETURNING id',
      [id]
    );
    return rows[0];
  },

  async monthlyTrend() {
    const { rows } = await pool.query(
      `SELECT TO_CHAR(observation_date,'YYYY-MM') AS month, COUNT(*) AS count
       FROM plant_records
       WHERE observation_date >= NOW() - INTERVAL '12 months'
       GROUP BY month ORDER BY month`
    );
    return rows;
  },
};

module.exports = PlantModel;
