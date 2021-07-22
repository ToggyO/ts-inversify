/**
 * Description: Create new admins table
 */

import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

const schema = require('../schemas/admin/admin');

module.exports = {
  up: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
    await queryInterface.createTable('admins', schema(sequelize, DataTypes));
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('admins', undefined);
  },
};
