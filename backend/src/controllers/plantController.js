const { validationResult } = require('express-validator');
const PlantModel = require('../models/plantModel');
const pool = require('../config/db');

const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status, date_from, date_to } = req.query;
    const result = await PlantModel.findAll({
      page: parseInt(page), limit: parseInt(limit),
      search, status, date_from, date_to,
    });
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

const getOne = async (req, res) => {
  try {
    const record = await PlantModel.findById(parseInt(req.params.id));
    if (!record) return res.status(404).json({ error: 'Record not found' });
    return res.json(record);
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const record = await PlantModel.create({ ...req.body, user_id: req.user.id });

    if (req.files && req.files.length) {
      for (const file of req.files) {
        await pool.query(
          `INSERT INTO record_images (record_type, record_id, image_url) VALUES ('plant', $1, $2)`,
          [record.id, `/uploads/${file.filename}`]
        );
      }
    }

    return res.status(201).json(record);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

const update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const id = parseInt(req.params.id);
    const existing = await PlantModel.findById(id);
    if (!existing) return res.status(404).json({ error: 'Record not found' });

    if (req.user.role !== 'admin' && existing.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const updated = await PlantModel.update(id, req.body);
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

const updateStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const validStatuses = ['pending', 'verified', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    const updated = await PlantModel.updateStatus(id, status);
    if (!updated) return res.status(404).json({ error: 'Record not found' });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

const remove = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await PlantModel.findById(id);
    if (!existing) return res.status(404).json({ error: 'Record not found' });

    if (req.user.role !== 'admin' && existing.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    await PlantModel.delete(id);
    return res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

const stats = async (req, res) => {
  try {
    const trend = await PlantModel.monthlyTrend();
    return res.json({ trend });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAll, getOne, create, update, updateStatus, remove, stats };
