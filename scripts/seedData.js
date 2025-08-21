const mongoose = require('mongoose');
const Client = require('../src/models/Client');
const Telephone = require('../src/models/Telephone');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/app_client');
    
    // Vider les collections
    await Client.deleteMany({});
    await Telephone.deleteMany({});
    
    // Créer des clients
    const clients = await Client.insertMany([
      {
        nom: 'Diop',
        prenom: 'Amadou',
        photo: 'https://example.com/photos/amadou.jpg'
      },
      {
        nom: 'Fall',
        prenom: 'Aisha',
        photo: 'https://example.com/photos/aisha.jpg'
      },
      {
        nom: 'Ndiaye',
        prenom: 'Ibrahima',
        photo: 'https://example.com/photos/ibrahima.jpg'
      },
      {
        nom: 'Sy',
        prenom: 'Fatou',
        photo: 'https://example.com/photos/fatou.jpg'
      }
    ]);
    
    // Créer des téléphones
    const telephones = [
      {
        numero: '771234567',
        dateOptension: new Date('2023-01-15'),
        active: true,
        client: clients[0]._id
      },
      {
        numero: '772345678',
        dateOptension: new Date('2023-02-20'),
        active: true,
        client: clients[0]._id
      },
      {
        numero: '773456789',
        dateOptension: new Date('2023-03-10'),
        active: true,
        client: clients[1]._id
      },
      {
        numero: '774567890',
        dateOptension: new Date('2023-04-05'),
        active: false,
        client: clients[1]._id
      },
      {
        numero: '775678901',
        dateOptension: new Date('2023-05-12'),
        active: true,
        client: clients[2]._id
      },
      {
        numero: '776789012',
        dateOptension: new Date('2023-06-18'),
        active: true,
        client: clients[3]._id
      }
    ];
    
    await Telephone.insertMany(telephones);
    
    console.log('Données de test insérées avec succès');
    console.log(`${clients.length} clients créés`);
    console.log(`${telephones.length} téléphones créés`);
    
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;