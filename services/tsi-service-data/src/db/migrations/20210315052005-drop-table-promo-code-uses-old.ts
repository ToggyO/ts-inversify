/**
 * Description: Drop old promo_code_uses table
 */

import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

const schema = require('../schemas/promo/promo-code-uses');

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('promo_code_uses', undefined);
  },

  down: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
    await queryInterface.createTable('promo_code_uses', schema(sequelize, DataTypes));
  },
};
