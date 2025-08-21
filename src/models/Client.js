const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
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
  photo: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});
module.exports = mongoose.model("Client", ClientSchema);
