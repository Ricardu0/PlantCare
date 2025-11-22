const express = require('express');
const router = express.Router();
const controller = require('../controllers/plantaController');


router.get('/', controller.listPlantas);
router.get('/:id', controller.getPlanta);
router.post('/', controller.createPlanta);
router.put('/:id', controller.updatePlanta);
router.delete('/:id', controller.deletePlanta);


module.exports = router;