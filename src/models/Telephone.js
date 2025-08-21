
const mongoose = require('mongoose');

const telephoneSchema = new mongoose.Schema({
  numero: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  dateOptension: {
    type: Date,
    required: true,
    default: Date.now
  },
  active: {
    type: Boolean,
    required: true,
    default: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  }
}, {
  timestamps: true
});

// Index pour optimiser les recherches
telephoneSchema.index({ numero: 1 });
telephoneSchema.index({ client: 1 });
telephoneSchema.index({ active: 1 });

module.exports = mongoose.model('Telephone', telephoneSchema);
