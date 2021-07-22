/**
 * Description: Create e_tickets table
 */

import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

const schema = require('../schemas/tickets/e-ticket');

module.exports = {
  up: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
    await queryInterface.createTable('e_tickets', schema(sequelize, DataTypes));
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('e_tickets', undefined);
  },
};
