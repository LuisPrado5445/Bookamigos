const { Sequelize, DataTypes } = require('sequelize');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD); // Añade esto justo antes de Sequelize

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, DataTypes);
db.Book = require('./book')(sequelize, DataTypes);

// Relaciones
db.User.associate(db);
db.Book.associate(db);

module.exports = db;
