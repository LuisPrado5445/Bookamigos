const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [6, 100] }
    },
    fotoperfil: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'fotoperfil'
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'descripcion'
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'resettoken'
    },
    resetTokenExpiration: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'resettokenexpiration'
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'confirmed'
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'createdAt'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updatedAt'
    }
  }, {
    tableName: 'users',
    timestamps: true,
    freezeTableName: true
  });

    User.associate = (models) => {
    User.hasMany(models.Book, {
      foreignKey: 'usuarioId',
      as: 'libros',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
    User.hasMany(models.Follow, { foreignKey: 'seguidorId', as: 'siguiendo' });
    User.hasMany(models.Follow, { foreignKey: 'seguidoId', as: 'seguidores' });
;
  };

  return User;
};

