const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const logMiddleware = require('../middleware/logMiddleware');

// Appliquer le middleware de log à toutes les routes
router.use(logMiddleware);

// Routes pour les clients
router.get('/', clientController.getAllClients);
router.get('/clients/:numero', clientController.getClientByNumero); // Route principale pour max-it
router.get('/:clientId', clientController.getClientById);
router.post('/', clientController.createClient);
router.put('/:clientId', clientController.updateClient);
router.delete('/:clientId', clientController.deleteClient);

module.exports = router;

