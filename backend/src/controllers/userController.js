const UserModel = require('../models/userModel');

const listUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await UserModel.findAll({ page: parseInt(page), limit: parseInt(limit) });
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

const updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ['admin', 'researcher', 'viewer'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const user = await UserModel.updateRole(parseInt(req.params.id), role);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

const deactivate = async (req, res) => {
  try {
    const user = await UserModel.deactivate(parseInt(req.params.id));
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ message: 'User deactivated', user });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { listUsers, updateRole, deactivate };
