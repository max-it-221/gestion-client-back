const Client = require('../models/client.model');

exports.createClient = async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ message: 'Erreur de création du client', error: err });
  }
};

// 📃 Lister tous les clients
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération', error: err });
  }
};

// 🔍 Récupérer un client par numéro
exports.getClientByNumero = async (req, res) => {
  try {
    const numero = req.params.numero;
    const client = await Client.findOne({ 
      numeros: { $elemMatch: { numero: numero, active: true } }
    });

    if (!client) {
      return res.status(404).json({ message: 'Client introuvable ou numéro inactif' });
    }

    res.json(client);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};
