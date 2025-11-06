const mongoose = require('mongoose');

const requestLogSchema = new mongoose.Schema({
  numero: {
    type: String,
    required: true,
    trim: true
  },
  operation: {
    type: String,
    required: true,
    enum: ['GET_CLIENT', 'SEARCH_CLIENT']
  },
  statut: {
    type: String,
    required: true,
    enum: ['SUCCESS', 'ERROR', 'NOT_FOUND', 'INACTIVE']
  },
  message: {
    type: String,
    default: null
  },
  comptePrincipal: {
    type: String,
    default: null // Numéro du compte Maxit qui fait la demande
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  dateRequete: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
requestLogSchema.index({ numero: 1, dateRequete: -1 });
requestLogSchema.index({ comptePrincipal: 1, dateRequete: -1 });
requestLogSchema.index({ statut: 1 });

module.exports = mongoose.model('RequestLog', requestLogSchema);