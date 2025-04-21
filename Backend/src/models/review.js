module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
      contenido: DataTypes.TEXT,
      calificacion: DataTypes.INTEGER
    });
  
    Review.associate = (models) => {
      Review.belongsTo(models.User, { foreignKey: 'usuarioId' });
      Review.belongsTo(models.Book, { foreignKey: 'libroId' });
    };
  
    return Review;
  };
  
