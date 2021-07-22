/**
 * Description: Add index on field `name` of products table
 */

import { QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addIndex('products', ['name'], {
      name: 'product_name',
      unique: false,
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeIndex('products', 'product_name');
  },
};
