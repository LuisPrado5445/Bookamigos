const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');
const authenticateToken  = require('../middleware/authMiddleware');

router.post('/', authenticateToken, followController.seguirUsuario);
router.get('/:id', followController.obtenerSeguidores);

module.exports = router;
