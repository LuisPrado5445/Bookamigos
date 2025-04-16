// backend/models/user.js
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      nombre: DataTypes.STRING,
      email: DataTypes.STRING,
      // otros campos
    });
  
    User.associate = (models) => {
      User.hasMany(models.Book, {
        foreignKey: 'usuarioId',
        as: 'libros'
      });
    };
  
    return User;
  };
  