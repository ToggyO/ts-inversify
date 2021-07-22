/**
 * Description: sales_flat_order_payments table migration
 */

import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

const schema = require('../schemas/sales-flat-order/sales-flat-order-payment');

module.exports = {
  up: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
    await queryInterface.createTable('sales_flat_order_payments', schema(sequelize, DataTypes));
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('sales_flat_order_payments', undefined);
  },
};
