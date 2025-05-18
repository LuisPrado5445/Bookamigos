// ✅ Limpio y corregido userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');
const authorizeOwner = require('../middleware/AuthorizeOwner');
const upload = require('../middleware/UploadMiddleware');

// ✅ Registro y autenticación
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/admin', userController.createAdminUser);

// ✅ Perfil del usuario autenticado
router.get('/me', authenticate, userController.getProfile);
router.put('/me', authenticate, userController.updateProfile);

// 📤 Subir imagen de perfil
router.put('/me/upload-foto', authenticate, upload.single('foto'), userController.subirFotoPerfil);

// ✅ Confirmación y recuperación
router.post('/send-password-reset', userController.sendPasswordResetEmail);
router.post('/reset-password/:token', userController.resetPassword);
router.get('/confirm/:id', userController.confirmEmail);
router.put('/cambiar-password/:id', authenticate, authorizeOwner, userController.cambiarPassword)

// ✅ Operaciones sobre usuarios
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', authenticate, authorizeOwner, userController.updateUser);
router.delete('/:id', authenticate, userController.deleteUser);

module.exports = router;
