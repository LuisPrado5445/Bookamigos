'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Verifica si la columna ya existe antes de agregarla
    const tableInfo = await queryInterface.describeTable('Books');
    if (!tableInfo.puntuacion) {
      await queryInterface.addColumn('Books', 'puntuacion', {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Intenta eliminar la columna solo si existe
    const tableInfo = await queryInterface.describeTable('Books');
    if (tableInfo.puntuacion) {
      await queryInterface.removeColumn('Books', 'puntuacion');
    }
  }
};
