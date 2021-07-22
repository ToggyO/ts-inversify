/**
 * Description: sales_flat_order_meta table migration
 */

import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

const schema = require('../schemas/sales-flat-order/sales-flat-order-items-meta');

module.exports = {
  up: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
    await queryInterface.createTable('sales_flat_order_items_meta', schema(sequelize, DataTypes));
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('sales_flat_order_items_meta', undefined);
  },
};
