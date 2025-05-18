const express = require('express')
const router = express.Router()
const bookController = require('../controllers/bookController')
const verifyToken = require('../middleware/authMiddleware')
const authorizeResourceOwner = require('../middleware/AuthorizeResourceOwner')
const { Book } = require('../models')

// Crear un libro
router.post('/', verifyToken, bookController.crearLibro)

// Obtener todos los libros
router.get('/', bookController.getAllBooks)

// Obtener un libro por ID
router.get('/:id', bookController.getBookById)

// Editar un libro (solo el creador puede)
router.put('/:id', verifyToken, authorizeResourceOwner(Book), bookController.updateBook)

// Eliminar un libro (solo el creador puede)
router.delete('/:id', verifyToken, authorizeResourceOwner(Book), bookController.deleteBook)

module.exports = router
