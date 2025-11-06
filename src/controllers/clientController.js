// src/controllers/clientController.js
const { validationResult } = require('express-validator');
const clientService = require('../services/clientService');

class ClientController {

  /**
   * GET /api/clients/:numero
   * Récupère un client par son numéro
   */
  async getClient(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { numero } = req.params;
      const comptePrincipal = req.query.comptePrincipal || req.headers['x-compte-principal'];
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await clientService.getClientByNumero(
        numero, 
        comptePrincipal, 
        ipAddress, 
        userAgent
      );

      if (!result.success) {
        return res.status(404).json(result);
      }

      return res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/clients
   * Recherche des clients (pour admin)
   */
  async searchClients(req, res, next) {
    try {
      const { numero, nom, prenom, active, page = 1, limit = 10 } = req.query;

      const filters = {};
      if (numero) filters.numero = numero;
      if (nom) filters.nom = nom;
      if (prenom) filters.prenom = prenom;
      if (active !== undefined) filters.active = active === 'true';

      const result = await clientService.searchClients(
        filters,
        parseInt(page),
        parseInt(limit)
      );

      return res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/logs/compte/:comptePrincipal
   * Récupère les logs d'un compte principal
   */
  async getLogsByCompte(req, res, next) {
    try {
      const { comptePrincipal } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const result = await clientService.getRequestLogsByCompte(
        comptePrincipal,
        parseInt(page),
        parseInt(limit)
      );

      return res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/logs
   * Récupère tous les logs avec filtres
   */
  async getAllLogs(req, res, next) {
    try {
      const { 
        numero, 
        statut, 
        comptePrincipal, 
        dateDebut, 
        dateFin, 
        page = 1, 
        limit = 20 
      } = req.query;

      const filters = {};
      if (numero) filters.numero = numero;
      if (statut) filters.statut = statut;
      if (comptePrincipal) filters.comptePrincipal = comptePrincipal;
      if (dateDebut) filters.dateDebut = dateDebut;
      if (dateFin) filters.dateFin = dateFin;

      const result = await clientService.getAllRequestLogs(
        filters,
        parseInt(page),
        parseInt(limit)
      );

      return res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/health
   * Vérifie le statut du service
   */
  async healthCheck(req, res) {
    return res.status(200).json({
      success: true,
      service: 'GesClient',
      status: 'UP',
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = new ClientController();