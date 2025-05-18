const express = require('express')
const router = express.Router()
const reviewController = require('../controllers/reviewController')
const authenticateToken = require('../middleware/authMiddleware')
const authorizeResourceOwner = require('../middleware/AuthorizeResourceOwner')
const { Review } = require('../models')
const { check, validationResult } = require('express-validator')
// Obtener todas las reseñas
router.get('/', reviewController.getReviews);

// Obtener reseñas por libro
router.get('/libro/:libroId', [
  check('libroId').isInt().withMessage('El libroId debe ser un número válido.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
], reviewController.getReviewsByBook); // 👈 asegúrate de que esta función exista en el controlador

// Obtener una reseña individual por ID
router.get('/:id', reviewController.getReviewById);

// Crear nueva reseña (autenticación requerida)
router.post('/', authenticateToken, [
  check('contenido').notEmpty().withMessage('El contenido es obligatorio'),
  check('puntuacion').isInt({ min: 1, max: 5 }).withMessage('La puntuación debe ser entre 1 y 5'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
], reviewController.createReview);

// Actualizar una reseña (solo el autor puede hacerlo)

router.put('/:id', authenticateToken, authorizeResourceOwner(Review), reviewController.updateReview)

// Eliminar reseña (solo autor)
router.delete('/:id', authenticateToken, authorizeResourceOwner(Review), reviewController.deleteReview)

module.exports = router;

