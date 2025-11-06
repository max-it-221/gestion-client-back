const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  numero: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^(77|78|76|70|75)[0-9]{7}$/ // Format numéros sénégalais
  },
  nom: {
    type: String,
    required: true,
    trim: true
  },
  prenom: {
    type: String,
    required: true,
    trim: true
  },
  nci: {
    type: String,
    required: true,
    trim: true
  },
  photo: {
    type: String,
    default: null
  },
  active: {
    type: Boolean,
    default: true
  },
  dateCreation: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances de recherche
clientSchema.index({ numero: 1 });
clientSchema.index({ active: 1 });

module.exports = mongoose.model('Client', clientSchema);

