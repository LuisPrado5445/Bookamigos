const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Book = sequelize.define('Book', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    autor: {
      type: DataTypes.STRING,
      allowNull: false
    },
    portada: {
      type: DataTypes.STRING,
      allowNull: true
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    disponible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      field: 'usuarioid', // 👈 mapeo explícito al nombre real de columna
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'books',
    timestamps: true,
    createdAt: 'createdat', // 👈 campo real en minúscula
    updatedAt: 'updatedat',
    freezeTableName: true
  });

  Book.associate = (models) => {
    Book.belongsTo(models.User, {
      foreignKey: 'usuarioId',
      as: 'creador',
      //onDelete: 'CASCADE',
     // onUpdate: 'CASCADE',
    });
  };

  return Book;
};
