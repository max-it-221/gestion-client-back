require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const clientRoutes = require('./routes/client.routes');
const logger = require('./middleware/logger');
const Client = require('./models/client.model'); // Nécessaire pour createCollection

const app = express();
const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
  .then(async () => {
  
    console.log("✅ Connexion MongoDB réussie");

    // 🔧 Crée la collection si elle n'existe pas
    const collections = await mongoose.connection.db.listCollections().toArray();
    const exists = collections.some(c => c.name === 'clients');

    console.log("📁 Collection 'clients' créée automatiquement");
    if (!exists) {
      await Client.createCollection();

    }
  })
  .catch((err) => console.error("❌ Erreur MongoDB:", err));

app.use(express.json());
app.use(logger);

// Routes
app.use('/clients', clientRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});