/**
 * Description: product_media table migration
 */

import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

const schema = require('../schemas/product/product-media');

module.exports = {
  up: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
    await queryInterface.createTable('product_media', schema(sequelize, DataTypes));
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('product_media', undefined);
  },
};
