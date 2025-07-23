const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
  prenom: { type: String, required: true },
  nom: { type: String, required: true },
  photo: String
}, { timestamps: true });

module.exports = mongoose.model("Client", ClientSchema);
