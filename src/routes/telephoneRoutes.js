// routes/telephoneRoutes.js
const express = require('express');
const router = express.Router();
const telephoneController = require('../controllers/telephoneController');
const logMiddleware = require('../middleware/logMiddleware');

// Appliquer le middleware de log à toutes les routes
router.use(logMiddleware);

// Routes pour les téléphones
router.get('/', telephoneController.getAllTelephones);
router.post('/', telephoneController.createTelephone);
router.put('/:numero', telephoneController.updateTelephone);
router.patch('/:numero/toggle-status', telephoneController.toggleTelephoneStatus);
router.delete('/:numero', telephoneController.deleteTelephone);

module.exports = router;