const Telephone = require('../models/Telephone');
const Client = require('../models/Client');
const Joi = require('joi');

// Schema de validation pour téléphone
const telephoneSchema = Joi.object({
    numero: Joi.string().min(8).max(15).required(),
    dateOptension: Joi.date().optional(),
    active: Joi.boolean().optional(),
    clientId: Joi.string().required()
});

const telephoneController = {
    // Créer un nouveau téléphone
    createTelephone: async (req, res) => {
        try {
            const { error, value } = telephoneSchema.validate(req.body);

            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            // Vérifier si le client existe
            const client = await Client.findById(value.clientId);
            if (!client) {
                return res.status(404).json({ error: 'Client non trouvé' });
            }

            // Vérifier si le numéro existe déjà
            const existingTelephone = await Telephone.findOne({ numero: value.numero });
            if (existingTelephone) {
                return res.status(409).json({ error: 'Ce numéro de téléphone existe déjà' });
            }

            const telephone = new Telephone({
                numero: value.numero,
                dateOptension: value.dateOptension || new Date(),
                active: value.active !== undefined ? value.active : true,
                client: value.clientId
            });

            await telephone.save();
            await telephone.populate('client');

            res.status(201).json(telephone);
        } catch (error) {
            console.error('Erreur lors de la création du téléphone:', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    },

    // Lister tous les téléphones
    getAllTelephones: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            // Filtres
            const filters = {};
            if (req.query.active !== undefined) filters.active = req.query.active === 'true';
            if (req.query.clientId) filters.client = req.query.clientId;

            const telephones = await Telephone.find(filters)
                .populate('client')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const total = await Telephone.countDocuments(filters);

            res.json({
                telephones,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des téléphones:', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    },

    // Mettre à jour un téléphone
    updateTelephone: async (req, res) => {
        try {
            const { numero } = req.params;
            const updates = req.body;

            // Valider les champs modifiables
            const allowedUpdates = ['active', 'dateOptension'];
            const updateFields = {};

            for (const field of allowedUpdates) {
                if (updates[field] !== undefined) {
                    updateFields[field] = updates[field];
                }
            }

            const telephone = await Telephone.findOneAndUpdate(
                { numero: numero },
                updateFields,
                { new: true, runValidators: true }
            ).populate('client');

            if (!telephone) {
                return res.status(404).json({ error: 'Téléphone non trouvé' });
            }

            res.json(telephone);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du téléphone:', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    },

    // Activer/Désactiver un téléphone
    toggleTelephoneStatus: async (req, res) => {
        try {
            const { numero } = req.params;

            const telephone = await Telephone.findOne({ numero: numero });

            if (!telephone) {
                return res.status(404).json({ error: 'Téléphone non trouvé' });
            }

            telephone.active = !telephone.active;
            await telephone.save();
            await telephone.populate('client');

            res.json({
                message: `Téléphone ${telephone.active ? 'activé' : 'désactivé'} avec succès`,
                telephone: telephone
            });
        } catch (error) {
            console.error('Erreur lors du changement de statut du téléphone:', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    },

    // Supprimer un téléphone
    deleteTelephone: async (req, res) => {
        try {
            const { numero } = req.params;

            const telephone = await Telephone.findOneAndDelete({ numero: numero });

            if (!telephone) {
                return res.status(404).json({ error: 'Téléphone non trouvé' });
            }

            res.json({ message: 'Téléphone supprimé avec succès' });
        } catch (error) {
            console.error('Erreur lors de la suppression du téléphone:', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    }
};

module.exports = telephoneController;