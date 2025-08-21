const mongoose = require('mongoose');

const requestLogSchema = new mongoose.Schema({
    endpoint: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    numeroTelephone: {
        type: String,
        default: null
    },
    clientId: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['SUCCESS', 'ERROR', 'NOT_FOUND', 'INACTIVE'],
        required: true
    },
    message: {
        type: String,
        default: null
    },
    requestTime: {
        type: Date,
        default: Date.now
    },
    responseTime: {
        type: Number // en millisecondes
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    }
}, {
    timestamps: true
});

// Index pour les requêtes de logs
requestLogSchema.index({ requestTime: -1 });
requestLogSchema.index({ numeroTelephone: 1 });
requestLogSchema.index({ status: 1 });

module.exports = mongoose.model('RequestLog', requestLogSchema);