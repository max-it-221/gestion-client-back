const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const clientRoutes = require('./routes/clientRoutes');
const telephoneRoutes = require('./routes/telephoneRoutes');
const logRoutes = require('./routes/logRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/app_client', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connecté à MongoDB'))
.catch(err => console.error('Erreur de connexion MongoDB:', err));

// Routes
app.use('/api', clientRoutes);
app.use('/api/telephones', telephoneRoutes);
app.use('/api/logs', logRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

app.listen(PORT, () => {
  console.log(`Serveur app-client démarré sur le port ${PORT}`);
});
