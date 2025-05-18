const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Review = sequelize.define('Review', {
    contenido: {
      type: DataTypes.STRING,
      allowNull: false
    },
    puntuacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'usuarioid', // 👈 coincide con tu BD
      references: {
        model: 'users',
        key: 'id'
      }
    },
    libroId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'libroid', // 👈 coincide con tu BD
      references: {
        model: 'Books',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'createdat' // 👈 este es el fix clave
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updatedat'
    }
  }, {
    tableName: 'reviews',
    timestamps: true
  });

  Review.associate = (models) => {
    Review.belongsTo(models.User, { foreignKey: 'usuarioId', as: 'autorReview' });
    Review.belongsTo(models.Book, { foreignKey: 'libroId', as: 'libroReview' });
  };

  return Review;
};
