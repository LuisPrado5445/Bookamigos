module.exports = (sequelize, DataTypes) => {
    const Follow = sequelize.define('Follow', {
      seguidorId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      seguidoId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['seguidorId', 'seguidoId']
        }
      ]
    });
  
    Follow.associate = (db) => {
      db.Follow.belongsTo(db.User, { as: 'seguidor', foreignKey: 'seguidorId' });
      db.Follow.belongsTo(db.User, { as: 'seguido', foreignKey: 'seguidoId' });
    };
  
    return Follow;
  };
  
