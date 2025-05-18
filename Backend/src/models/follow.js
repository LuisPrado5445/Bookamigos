const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Follow = sequelize.define('Follow', {
    seguidorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'seguidorid',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    seguidoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'seguidoid',
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'follows',
    timestamps: true,
    createdAt: 'createdat',
    updatedAt: 'updatedat'
  });
  
  Follow.associate = (models) => {
    Follow.belongsTo(models.User, { foreignKey: 'seguidorId', as: 'seguidor' });
    Follow.belongsTo(models.User, { foreignKey: 'seguidoId', as: 'seguido' });
  };
  
  return Follow;
};
