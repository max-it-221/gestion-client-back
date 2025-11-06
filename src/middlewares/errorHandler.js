
/**
 * Middleware de gestion des erreurs
 */
const errorHandler = (err, req, res, next) => {
  console.error('❌ Erreur:', err);

  // Erreur de validation Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Erreur de validation',
      details: errors
    });
  }

  // Erreur de duplication MongoDB
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      error: 'DUPLICATE_ERROR',
      message: 'Ce numéro existe déjà dans la base de données'
    });
  }

  // Erreur CastError (ID MongoDB invalide)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'INVALID_ID',
      message: 'ID invalide'
    });
  }

  // Erreur générique
  return res.status(err.statusCode || 500).json({
    success: false,
    error: err.error || 'SERVER_ERROR',
    message: err.message || 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * Middleware pour les routes non trouvées
 */
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: `Route non trouvée: ${req.method} ${req.originalUrl}`
  });
};

module.exports = { errorHandler, notFound };