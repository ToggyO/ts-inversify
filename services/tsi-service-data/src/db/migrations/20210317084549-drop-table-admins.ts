/**
 * Description: Drop old admins table
 */

import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

const schema = require('../schemas/admin/admin');

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('admins', undefined);
  },

  down: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
    await queryInterface.createTable('admins', schema(sequelize, DataTypes));
  },
};
