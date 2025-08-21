const RequestLog = require('../models/RequestLog');

const logRequest = async (req, res, next) => {
    const startTime = Date.now();

    // Capture de la réponse originale
    const originalSend = res.send;
    let responseData = null;
    let statusCode = 200;

    res.send = function(data) {
        responseData = data;
        statusCode = res.statusCode;
        originalSend.call(this, data);
    };

    // Attendre la fin de la requête
    res.on('finish', async () => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        try {
            let status = 'SUCCESS';
            let message = null;

            if (statusCode >= 400) {
                if (statusCode === 404) {
                    status = 'NOT_FOUND';
                } else if (statusCode === 403) {
                    status = 'INACTIVE';
                } else {
                    status = 'ERROR';
                }

                if (responseData) {
                    try {
                        const parsed = JSON.parse(responseData);
                        message = parsed.error || parsed.message || 'Erreur inconnue';
                    } catch (e) {
                        message = responseData;
                    }
                }
            }

            await RequestLog.create({
                endpoint: req.originalUrl,
                method: req.method,
                numeroTelephone: req.params.numero || req.body.numero || null,
                clientId: req.params.clientId || req.body.clientId || null,
                status: status,
                message: message,
                responseTime: responseTime,
                ipAddress: req.ip || req.connection.remoteAddress,
                userAgent: req.get('User-Agent')
            });
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement du log:', error);
        }
    });

    next();
};

module.exports = logRequest;