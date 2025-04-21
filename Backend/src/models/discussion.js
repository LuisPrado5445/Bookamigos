module.exports = (sequelize, DataTypes) => {
    const Discusion = sequelize.define('Discusion', {
      contenido: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      libroId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      tableName: 'discusiones'
    });
  
    Discusion.associate = (models) => {
      Discusion.belongsTo(models.User, { foreignKey: 'usuarioId', as: 'usuario' });
      Discusion.belongsTo(models.Book, { foreignKey: 'libroId', as: 'libro' });
    };
  
    return Discusion;
  };
  
