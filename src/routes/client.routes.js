const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');


// Routes liées au client
router.post('/', clientController.createClient);
router.get('/', clientController.getAllClients);
router.get('/by-numero/:numero', clientController.getClientByNumero);

module.exports = router;
