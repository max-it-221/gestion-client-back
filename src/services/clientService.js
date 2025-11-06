// src/services/clientService.js
const Client = require('../models/Client');
const RequestLog = require('../models/RequestLog');

class ClientService {
  
  /**
   * Récupère un client à partir de son numéro
   * Vérifie l'existence et le statut actif
   */
  async getClientByNumero(numero, comptePrincipal = null, ipAddress = null, userAgent = null) {
    try {
      // Recherche du client
      const client = await Client.findOne({ numero });

      // Client n'existe pas
      if (!client) {
        await this.logRequest({
          numero,
          operation: 'GET_CLIENT',
          statut: 'NOT_FOUND',
          message: 'Client non trouvé',
          comptePrincipal,
          ipAddress,
          userAgent
        });

        return {
          success: false,
          error: 'CLIENT_NOT_FOUND',
          message: 'Aucun client trouvé avec ce numéro'
        };
      }

      // Client existe mais n'est pas actif
      if (!client.active) {
        await this.logRequest({
          numero,
          operation: 'GET_CLIENT',
          statut: 'INACTIVE',
          message: 'Client inactif',
          comptePrincipal,
          ipAddress,
          userAgent
        });

        return {
          success: false,
          error: 'CLIENT_INACTIVE',
          message: 'Ce numéro est inactif'
        };
      }

      // Client trouvé et actif - Succès
      await this.logRequest({
        numero,
        operation: 'GET_CLIENT',
        statut: 'SUCCESS',
        message: 'Client récupéré avec succès',
        comptePrincipal,
        ipAddress,
        userAgent
      });

      return {
        success: true,
        data: {
          numero: client.numero,
          nom: client.nom,
          prenom: client.prenom,
          nci: client.nci,
          photo: client.photo,
          active: client.active,
          dateCreation: client.dateCreation
        }
      };

    } catch (error) {
      // Erreur technique
      await this.logRequest({
        numero,
        operation: 'GET_CLIENT',
        statut: 'ERROR',
        message: `Erreur technique: ${error.message}`,
        comptePrincipal,
        ipAddress,
        userAgent
      });

      throw error;
    }
  }

  /**
   * Recherche des clients (pour l'admin)
   */
  async searchClients(filters = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const query = {};

    if (filters.numero) query.numero = new RegExp(filters.numero, 'i');
    if (filters.nom) query.nom = new RegExp(filters.nom, 'i');
    if (filters.prenom) query.prenom = new RegExp(filters.prenom, 'i');
    if (filters.active !== undefined) query.active = filters.active;

    const clients = await Client.find(query)
      .sort({ dateCreation: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Client.countDocuments(query);

    return {
      success: true,
      data: clients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Récupère les logs de demandes pour un compte principal
   */
  async getRequestLogsByCompte(comptePrincipal, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const logs = await RequestLog.find({ comptePrincipal })
      .sort({ dateRequete: -1 })
      .skip(skip)
      .limit(limit);

    const total = await RequestLog.countDocuments({ comptePrincipal });

    return {
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Récupère tous les logs avec filtres
   */
  async getAllRequestLogs(filters = {}, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const query = {};

    if (filters.numero) query.numero = filters.numero;
    if (filters.statut) query.statut = filters.statut;
    if (filters.comptePrincipal) query.comptePrincipal = filters.comptePrincipal;
    if (filters.dateDebut) query.dateRequete = { $gte: new Date(filters.dateDebut) };
    if (filters.dateFin) query.dateRequete = { ...query.dateRequete, $lte: new Date(filters.dateFin) };

    const logs = await RequestLog.find(query)
      .sort({ dateRequete: -1 })
      .skip(skip)
      .limit(limit);

    const total = await RequestLog.countDocuments(query);

    return {
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Journalise une demande
   */
  async logRequest(logData) {
    try {
      const log = new RequestLog(logData);
      await log.save();
      return log;
    } catch (error) {
      console.error('Erreur lors de la journalisation:', error);
    }
  }
}

module.exports = new ClientService();