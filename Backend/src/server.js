require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/authRoutes')); // quitado el espacio después de '/api/auth'
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/discusiones', require('./routes/discussionRoutes'));
app.use('/api/follows', require('./routes/followRoutes')); // ✅ Nueva ruta agregada

// Ruta de prueba principal
app.get('/', (req, res) => {
  res.send('🚀 API Bookamigos funcionando correctamente');
});

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la base de datos');
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
});

