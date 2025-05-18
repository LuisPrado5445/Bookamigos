console.log('📦 authRoutes cargado');
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/register', authController.register); // <-- ESTA ES LA NUEVA

module.exports = router;
