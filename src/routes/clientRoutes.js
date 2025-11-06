// src/routes/clientRoutes.js
const express = require('express');
const { param, query } = require('express-validator');
const clientController = require('../controllers/clientController');

const router = express.Router();

// Validation du format des numéros sénégalais
const validateNumero = param('numero')
  .matches(/^(77|78|76|70|75)[0-9]{7}$/)
  .withMessage('Format de numéro invalide. Format attendu: 77xxxxxxx, 78xxxxxxx, etc.');

// GET /api/health - Health check
router.get('/health', clientController.healthCheck);

// GET /api/clients/:numero - Récupérer un client par numéro
router.get(
  '/clients/:numero',
  validateNumero,
  clientController.getClient
);

// GET /api/clients - Rechercher des clients (Admin)
router.get(
  '/clients',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page doit être >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit doit être entre 1 et 100'),
    query('active').optional().isBoolean().withMessage('Active doit être un boolean')
  ],
  clientController.searchClients
);

// GET /api/logs/compte/:comptePrincipal - Logs d'un compte
router.get(
  '/logs/compte/:comptePrincipal',
  [
    param('comptePrincipal').notEmpty().withMessage('Compte principal requis'),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  clientController.getLogsByCompte
);

// GET /api/logs - Tous les logs avec filtres
router.get(
  '/logs',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('statut').optional().isIn(['SUCCESS', 'ERROR', 'NOT_FOUND', 'INACTIVE'])
  ],
  clientController.getAllLogs
);

module.exports = router;