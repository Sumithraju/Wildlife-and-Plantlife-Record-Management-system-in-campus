const express = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/wildlifeController');
const { authenticate, authorise } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

const wildlifeValidation = [
  body('species_name').trim().notEmpty().withMessage('Species name is required'),
  body('category').isIn(['mammal','bird','reptile','amphibian','insect','fish'])
    .withMessage('Invalid category'),
  body('observation_date').isDate().withMessage('observation_date is required and must be a valid date'),
  body('latitude').optional().isFloat({ min: -90, max: 90 }),
  body('longitude').optional().isFloat({ min: -180, max: 180 }),
];

// GET /api/wildlife  – public
router.get('/', ctrl.getAll);

// GET /api/wildlife/stats  – authenticated
router.get('/stats', authenticate, ctrl.stats);

// GET /api/wildlife/:id  – public
router.get('/:id', ctrl.getOne);

// POST /api/wildlife  – researcher | admin
router.post('/',
  authenticate,
  authorise('researcher', 'admin'),
  upload.array('images', 3),
  wildlifeValidation,
  ctrl.create
);

// PUT /api/wildlife/:id  – researcher (own) | admin
router.put('/:id',
  authenticate,
  authorise('researcher', 'admin'),
  upload.array('images', 3),
  wildlifeValidation,
  ctrl.update
);

// PATCH /api/wildlife/:id/status  – admin only
router.patch('/:id/status',
  authenticate,
  authorise('admin'),
  ctrl.updateStatus
);

// DELETE /api/wildlife/:id  – researcher (own) | admin
router.delete('/:id',
  authenticate,
  authorise('researcher', 'admin'),
  ctrl.remove
);

module.exports = router;
