
const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

// Routes pour les logs
router.get('/', logController.getAllLogs);
router.get('/stats', logController.getLogStats);

module.exports = router;