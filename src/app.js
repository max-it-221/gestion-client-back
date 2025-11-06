// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const clientRoutes = require('./routes/clientRoutes');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

const app = express();

// Middlewares de sécurité
app.use(helmet());
app.use(cors());

// Parsing du body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging des requêtes
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Route de base
app.get('/', (req, res) => {
  res.json({
    success: true,
    service: 'GesClient API',
    version: '1.0.0',
    description: 'Service de gestion des clients Orange',
    endpoints: {
      health: 'GET /api/health',
      getClient: 'GET /api/clients/:numero',
      searchClients: 'GET /api/clients',
      getLogs: 'GET /api/logs',
      getLogsByCompte: 'GET /api/logs/compte/:comptePrincipal'
    }
  });
});

// Routes API
app.use('/api', clientRoutes);

// Gestion des routes non trouvées
app.use(notFound);

// Gestion des erreurs
app.use(errorHandler);

module.exports = app;