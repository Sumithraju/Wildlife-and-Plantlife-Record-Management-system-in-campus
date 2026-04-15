const express = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/plantController');
const { authenticate, authorise } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

const plantValidation = [
  body('species_name').trim().notEmpty().withMessage('Species name is required'),
  body('observation_date').isDate().withMessage('observation_date is required and must be a valid date'),
  body('height_cm').optional().isInt({ min: 1 }).withMessage('Height must be a positive number'),
  body('iucn_status').optional().isIn(['LC','NT','VU','EN','CR','EW','EX'])
    .withMessage('Invalid IUCN status'),
  body('latitude').optional().isFloat({ min: -90, max: 90 }),
  body('longitude').optional().isFloat({ min: -180, max: 180 }),
];

router.get('/', ctrl.getAll);
router.get('/stats', authenticate, ctrl.stats);
router.get('/:id', ctrl.getOne);

router.post('/',
  authenticate,
  authorise('researcher', 'admin'),
  upload.array('images', 3),
  plantValidation,
  ctrl.create
);

router.put('/:id',
  authenticate,
  authorise('researcher', 'admin'),
  plantValidation,
  ctrl.update
);

router.patch('/:id/status',
  authenticate,
  authorise('admin'),
  ctrl.updateStatus
);

router.delete('/:id',
  authenticate,
  authorise('researcher', 'admin'),
  ctrl.remove
);

module.exports = router;
