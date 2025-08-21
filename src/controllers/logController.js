const RequestLog = require('../models/RequestLog');

const logController = {
    // Récupérer tous les logs avec filtres
    getAllLogs: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            const skip = (page - 1) * limit;

            // Filtres
            const filters = {};
            if (req.query.status) filters.status = req.query.status;
            if (req.query.numeroTelephone) filters.numeroTelephone = req.query.numeroTelephone;
            if (req.query.method) filters.method = req.query.method;

            // Filtre de date
            if (req.query.startDate || req.query.endDate) {
                filters.requestTime = {};
                if (req.query.startDate) filters.requestTime.$gte = new Date(req.query.startDate);
                if (req.query.endDate) filters.requestTime.$lte = new Date(req.query.endDate);
            }

            const logs = await RequestLog.find(filters)
                .skip(skip)
                .limit(limit)
                .sort({ requestTime: -1 });

            const total = await RequestLog.countDocuments(filters);

            res.json({
                logs,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des logs:', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    },

    // Statistiques des logs
    getLogStats: async (req, res) => {
        try {
            const stats = await RequestLog.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        avgResponseTime: { $avg: '$responseTime' }
                    }
                }
            ]);

            const totalRequests = await RequestLog.countDocuments();

            res.json({
                totalRequests,
                statusBreakdown: stats
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques:', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    }
};

module.exports = logController;