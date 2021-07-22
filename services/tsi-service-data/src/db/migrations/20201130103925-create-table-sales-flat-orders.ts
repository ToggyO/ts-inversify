/**
 * Description: sales_flat_orders table migration
 */

import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

const schema = require('../schemas/sales-flat-order/sales-flat-order');

module.exports = {
  up: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
    await queryInterface.createTable('sales_flat_orders', schema(sequelize, DataTypes));
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('sales_flat_orders', undefined);
  },
};
