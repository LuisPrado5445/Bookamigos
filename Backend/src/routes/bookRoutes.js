const express = require('express');
const router = express.Router();
const { getAllBooks, cargarLibrosDesdeJson } = require('../controllers/bookController');

router.get('/', getAllBooks);
router.post('/cargar-json', cargarLibrosDesdeJson); 

module.exports = router;
