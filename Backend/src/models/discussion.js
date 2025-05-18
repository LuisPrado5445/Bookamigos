const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Discussion = sequelize.define('Discussion', {
    titulo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'usuarioid',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    libroId: {
      type: DataTypes.INTEGER,
      allowNull: true, // lo hiciste opcional antes
      field: 'libroid',
      references: {
        model: 'books',
        key: 'id'
      }
    }
  }, {
    tableName: 'discussions',
    timestamps: true, // ✅ esto activa createdAt y updatedAt
    createdAt: 'createdat',   // ✅ nombre real en tu tabla
    updatedAt: 'updatedat'
  });

  Discussion.associate = (models) => {
    Discussion.belongsTo(models.User, { foreignKey: 'usuarioId', as: 'participante' });
    Discussion.belongsTo(models.Book, { foreignKey: 'libroId', as: 'libroComentado' });
  };

  return Discussion;
};
