const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('payments', 'payment_method', {
      type: DataTypes.ENUM('idram', 'ameria', 'acba'),
      allowNull: false,
      defaultValue: 'idram',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('payments', 'payment_method');
  }
};
