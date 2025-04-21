const express = require('express');
const router = express.Router();
const discussionController = require('../controllers/discussionController');

// Obtener todas las discusiones
router.get('/', discussionController.obtenerDiscusiones);

// Crear una nueva discusión
router.post('/', discussionController.crearDiscusion);

module.exports = router;
