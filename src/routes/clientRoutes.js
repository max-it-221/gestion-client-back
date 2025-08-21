const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');


// Routes liées au client
router.post('/', clientController.createClient);
router.get('/', clientController.getAllClients);
router.get('/:numero', clientController.getClientByNumero);

module.exports = router;
