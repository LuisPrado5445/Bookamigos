const express = require('express')
const router = express.Router()
const discussionController = require('../controllers/discussionController')
const authenticateToken = require('../middleware/authMiddleware')
const authorizeResourceOwner = require('../middleware/AuthorizeResourceOwner')
const { Discussion } = require('../models')
const { check, validationResult } = require('express-validator')

// Obtener todas las discusiones
router.get('/', discussionController.getAllDiscussions);

// Obtener una discusión por ID
router.get('/:id', discussionController.getDiscussionById);

// Crear nueva discusión
router.post('/', authenticateToken, [
  check('contenido').notEmpty().withMessage('El contenido es obligatorio'),
  check('libroId').isInt().withMessage('libroId debe ser un número válido')
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, discussionController.createDiscussion);

// Actualizar discusión (solo autor)
router.put('/:id', authenticateToken, authorizeResourceOwner(Discussion), discussionController.updateDiscussion)

// Eliminar discusión (solo autor)
router.delete('/:id', authenticateToken, authorizeResourceOwner(Discussion), discussionController.deleteDiscussion)

module.exports = router;
