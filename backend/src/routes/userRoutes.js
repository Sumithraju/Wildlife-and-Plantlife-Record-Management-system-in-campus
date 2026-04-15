const express = require('express');
const ctrl = require('../controllers/userController');
const { authenticate, authorise } = require('../middleware/auth');

const router = express.Router();

// GET /api/users  – admin only
router.get('/', authenticate, authorise('admin'), ctrl.listUsers);

// PATCH /api/users/:id/role  – admin only
router.patch('/:id/role', authenticate, authorise('admin'), ctrl.updateRole);

// DELETE /api/users/:id  – admin only
router.delete('/:id', authenticate, authorise('admin'), ctrl.deactivate);

module.exports = router;
