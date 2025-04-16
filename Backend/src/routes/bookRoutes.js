// src/routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const { getAllBooks, cargarLibrosDesdeJson } = require('../controllers/bookController');

router.get('/', getAllBooks);
router.post('/cargar-json', cargarLibrosDesdeJson); // <-- esta es nueva

module.exports = router;
