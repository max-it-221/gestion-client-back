const mongoose = require("mongoose");

const NumeroSchema = new mongoose.Schema({
  numero: { type: String, required: true, unique: true },
  dateObtention: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }
}, { timestamps: true });

module.exports = mongoose.model("Numero", NumeroSchema);
