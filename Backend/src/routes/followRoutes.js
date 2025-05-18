const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');
const authenticate = require('../middleware/authMiddleware');

router.post('/', authenticate, followController.seguir);
router.delete('/:seguidoId', authenticate, followController.dejarDeSeguir);
router.get('/seguidores/:userId', followController.getSeguidores);
router.get('/seguidos/:userId', followController.getSeguidos);

module.exports = router;
