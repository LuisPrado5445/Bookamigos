// src/server.js

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');
const { sequelize } = require('./models');

const app  = express();
const PORT = process.env.PORT || 3001;

// 📁 Asegurar carpeta C:/temp_uploads/perfiles al iniciar (fuera del proyecto para evitar conflictos)
const UPLOADS_DIR = 'C:/temp_uploads/perfiles';
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log('📁 Carpeta creada al arrancar:', UPLOADS_DIR);
}

// 🔧 Middlewares
app.use(cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));
app.use(express.json());

// 📂 Servir archivos estáticos desde /uploads apuntando a C:/temp_uploads
app.use('/uploads', express.static('C:/temp_uploads'));

// 🚀 Rutas de tu API (todas intactas)
app.use('/api/auth',        require('./routes/authRoutes'));
app.use('/api/reviews',     require('./routes/reviewRoutes'));
app.use('/api/books',       require('./routes/bookRoutes'));
app.use('/api/discussions', require('./routes/discussionRoutes'));
app.use('/api/follows',     require('./routes/followRoutes'));
app.use('/api/users',       require('./routes/userRoutes'));

// ⚠️ Manejador de errores genérico
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Hubo un error en el servidor' });
});

// 🗄️ Conectar BD y arrancar servidor
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos');
    await sequelize.sync();
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
  }
});
