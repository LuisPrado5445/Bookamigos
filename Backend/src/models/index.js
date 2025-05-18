const { Sequelize, DataTypes } = require('sequelize');
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

// Cargar modelos
db.User = require('./user')(sequelize);
db.Book = require('./book')(sequelize);
db.Review = require('./review')(sequelize);
db.Discussion = require('./discussion')(sequelize);
db.Follow = require('./follow')(sequelize);

// Relaciones

// User - Book
db.User.hasMany(db.Book, { foreignKey: 'usuarioId' });

// User - Review
db.User.hasMany(db.Review, { foreignKey: 'usuarioId' });
// db.Review.belongsTo(db.User, { foreignKey: 'usuarioid', as: 'autorReview' });

// Book - Review
db.Book.hasMany(db.Review, { foreignKey: 'libroId' });
//db.Review.belongsTo(db.Book, { foreignKey: 'libroid', as: 'libroReview' });

// User - Discussion
db.User.hasMany(db.Discussion, { foreignKey: 'usuarioId' });
//db.Discussion.belongsTo(db.User, { foreignKey: 'usuarioId', as: 'participante' }); // 👈 CAMBIADO

// Book - Discussion
db.Book.hasMany(db.Discussion, { foreignKey: 'libroId' });
//db.Discussion.belongsTo(db.Book, { foreignKey: 'libroId', as: 'libroComentado' });

// Seguidores (User a User)
db.User.belongsToMany(db.User, {
  through: db.Follow,
  as: 'Seguidos',
  foreignKey: 'seguidorId',
  otherKey: 'seguidoId',
});
db.User.belongsToMany(db.User, {
  through: db.Follow,
  as: 'Seguidores',
  foreignKey: 'seguidoId',
  otherKey: 'seguidorId',
});

// Llamar associate si existe en algún modelo
if (db.Review.associate) db.Review.associate(db);
if (db.Book.associate) db.Book.associate(db);
if (db.User.associate) db.User.associate(db);
if (db.Discussion.associate) db.Discussion.associate(db);
if (db.Follow.associate) db.Follow.associate(db);

module.exports = db;
