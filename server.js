// server.js
require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 3001;

// Connexion à la base de données
connectDB();

// Démarrage du serveur
const server = app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 GesClient Service démarré`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log('='.repeat(50));
});

// Gestion de l'arrêt gracieux
process.on('SIGTERM', () => {
  console.log('⚠️  SIGTERM reçu. Fermeture du serveur...');
  server.close(() => {
    console.log('✅ Serveur fermé');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n⚠️  SIGINT reçu. Fermeture du serveur...');
  server.close(() => {
    console.log('✅ Serveur fermé');
    process.exit(0);
  });
});