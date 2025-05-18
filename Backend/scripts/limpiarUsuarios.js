require('dotenv').config();

console.log('🧪 Probando variables .env');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('Tipo de DB_PASSWORD:', typeof process.env.DB_PASSWORD);

const { sequelize, User } = require('../src/models'); // ajusta la ruta si es diferente

(async () => {
  try {
    await sequelize.authenticate();
    await User.destroy({ where: {} });
    console.log('✅ Todos los usuarios fueron eliminados');
    process.exit();
  } catch (error) {
    console.error('❌ Error eliminando usuarios:', error);
    process.exit(1);
  }
})();
