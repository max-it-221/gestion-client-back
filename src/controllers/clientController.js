const Client = require('../models/Client');
const Telephone = require('../models/Telephone');
const Joi = require('joi');

// Schema de validation pour client
const clientSchema = Joi.object({
  nom: Joi.string().min(2).max(50).required(),
  prenom: Joi.string().min(2).max(50).required(),
  photo: Joi.string().uri().optional()
});

const clientController = {
  // Récupérer un client par numéro de téléphone
  getClientByNumero: async (req, res) => {
    try {
      const { numero } = req.params;

      if (!numero) {
        return res.status(400).json({ error: 'Numéro de téléphone requis' });
      }

      // Chercher le téléphone avec le numéro donné
      const telephone = await Telephone.findOne({ numero: numero })
          .populate('client');

      if (!telephone) {
        return res.status(404).json({ error: 'Numéro de téléphone non trouvé' });
      }

      // Vérifier si le téléphone est actif
      if (!telephone.active) {
        return res.status(403).json({ error: 'Numéro de téléphone inactif' });
      }

      // Retourner les informations du client
      const clientData = {
        id: telephone.client._id,
        nom: telephone.client.nom,
        prenom: telephone.client.prenom,
        photo: telephone.client.photo,
        numeroTelephone: telephone.numero,
        dateOptension: telephone.dateOptension,
        active: telephone.active
      };

      res.json(clientData);
    } catch (error) {
      console.error('Erreur lors de la récupération du client:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  },

  // Créer un nouveau client
  createClient: async (req, res) => {
    try {
      const { error, value } = clientSchema.validate(req.body);

      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const client = new Client(value);
      await client.save();

      res.status(201).json(client);
    } catch (error) {
      console.error('Erreur lors de la création du client:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  },

  // Lister tous les clients avec leurs téléphones
  getAllClients: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const clients = await Client.find()
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 });

      // Récupérer les téléphones pour chaque client
      const clientsWithTelephones = await Promise.all(
          clients.map(async (client) => {
            const telephones = await Telephone.find({ client: client._id });
            return {
              ...client.toObject(),
              telephones: telephones
            };
          })
      );

      const total = await Client.countDocuments();

      res.json({
        clients: clientsWithTelephones,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  },

  // Récupérer un client par ID
  getClientById: async (req, res) => {
    try {
      const { clientId } = req.params;

      const client = await Client.findById(clientId);

      if (!client) {
        return res.status(404).json({ error: 'Client non trouvé' });
      }

      // Récupérer les téléphones du client
      const telephones = await Telephone.find({ client: clientId });

      res.json({
        ...client.toObject(),
        telephones: telephones
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du client:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  },

  // Mettre à jour un client
  updateClient: async (req, res) => {
    try {
      const { clientId } = req.params;
      const { error, value } = clientSchema.validate(req.body);

      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const client = await Client.findByIdAndUpdate(
          clientId,
          value,
          { new: true, runValidators: true }
      );

      if (!client) {
        return res.status(404).json({ error: 'Client non trouvé' });
      }

      res.json(client);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du client:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  },

  // Supprimer un client
  deleteClient: async (req, res) => {
    try {
      const { clientId } = req.params;

      // Supprimer d'abord tous les téléphones du client
      await Telephone.deleteMany({ client: clientId });

      // Supprimer le client
      const client = await Client.findByIdAndDelete(clientId);

      if (!client) {
        return res.status(404).json({ error: 'Client non trouvé' });
      }

      res.json({ message: 'Client et ses téléphones supprimés avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression du client:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  }
};

module.exports = clientController;