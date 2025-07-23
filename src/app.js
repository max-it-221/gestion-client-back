require('dotenv').config(); // Charge .env
const mongoose = require('mongoose');

// URI MongoDB
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ MONGODB_URI non défini dans le fichier .env");
  process.exit(1);
}

// Connexion à MongoDB
mongoose.connect(uri)
.then(() => console.log("✅ Connexion MongoDB réussie"))
.catch((err) => console.error("❌ Erreur MongoDB:", err));

const express = require("express");
const dotenv = require("dotenv");
const logger = require("./middleware/logger");

dotenv.config();
const app = express();

app.use(express.json());
app.use(logger);

const routes = require("./routes/client.routes");
app.use("/api", routes);
