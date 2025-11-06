// src/scripts/seedClients.js
require('dotenv').config();
const mongoose = require('mongoose');
const Client = require('../models/Client');

const clientsData = [
  {
    numero: '771234567',
    nom: 'Diop',
    prenom: 'Amadou',
    nci: '1234567890123',
    photo: 'https://example.com/photos/amadou.jpg',
    active: true
  },
  {
    numero: '772345678',
    nom: 'Ndiaye',
    prenom: 'Fatou',
    nci: '2345678901234',
    photo: 'https://example.com/photos/fatou.jpg',
    active: true
  },
  {
    numero: '773456789',
    nom: 'Sow',
    prenom: 'Moussa',
    nci: '3456789012345',
    photo: 'https://example.com/photos/moussa.jpg',
    active: true
  },
  {
    numero: '774567890',
    nom: 'Fall',
    prenom: 'Aissatou',
    nci: '4567890123456',
    photo: 'https://example.com/photos/aissatou.jpg',
    active: false // Compte inactif pour les tests
  },
  {
    numero: '775678901',
    nom: 'Ba',
    prenom: 'Ousmane',
    nci: '5678901234567',
    photo: 'https://example.com/photos/ousmane.jpg',
    active: true
  },
  {
    numero: '776789012',
    nom: 'Sarr',
    prenom: 'Mame Diarra',
    nci: '6789012345678',
    photo: 'https://example.com/photos/diarra.jpg',
    active: true
  },
  {
    numero: '777890123',
    nom: 'Thiam',
    prenom: 'Abdoulaye',
    nci: '7890123456789',
    photo: 'https://example.com/photos/abdoulaye.jpg',
    active: true
  },
  {
    numero: '778901234',
    nom: 'Gueye',
    prenom: 'Khady',
    nci: '8901234567890',
    photo: 'https://example.com/photos/khady.jpg',
    active: true
  },
  {
    numero: '780123456',
    nom: 'Cisse',
    prenom: 'Ibrahima',
    nci: '9012345678901',
    photo: 'https://example.com/photos/ibrahima.jpg',
    active: true
  },
  {
    numero: '781234567',
    nom: 'Diallo',
    prenom: 'Mariama',
    nci: '0123456789012',
    photo: 'https://example.com/photos/mariama.jpg',
    active: true
  }
];

const seedDatabase = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connecté à MongoDB');

    // Suppression des données existantes
    await Client.deleteMany({});
    console.log('🗑️  Anciennes données supprimées');

    // Insertion des nouvelles données
    const clients = await Client.insertMany(clientsData);
    console.log(`✅ ${clients.length} clients ajoutés avec succès`);

    // Affichage des clients
    console.log('\n📋 Liste des clients:');
    clients.forEach(client => {
      console.log(`   - ${client.numero} | ${client.prenom} ${client.nom} | ${client.active ? '✅ Actif' : '❌ Inactif'}`);
    });

    console.log('\n✨ Base de données peuplée avec succès!\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
};

seedDatabase();
