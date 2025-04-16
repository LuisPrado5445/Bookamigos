module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    titulo: DataTypes.STRING,
    autor: DataTypes.STRING,
    portada: DataTypes.STRING,
    descripcion: DataTypes.TEXT,
    disponible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    usuarioId: DataTypes.INTEGER
  }, {
    tableName: 'books' // 👈 Asegura que Sequelize use la tabla correcta
  });

  Book.associate = (models) => {
    Book.belongsTo(models.User, { foreignKey: 'usuarioId', as: 'usuario' });
  };

  return Book;
};
