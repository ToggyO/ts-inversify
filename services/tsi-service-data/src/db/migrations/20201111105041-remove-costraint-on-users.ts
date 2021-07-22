/**
 * Description: Remove constraint on foreign key `country_id` from users table
 */

import { QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // FIXME:
    await queryInterface.removeConstraint('users', 'users_country_id_foreign');
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.addConstraint('users', {
      name: 'users_country_id_foreign',
      type: 'foreign key',
      references: {
        table: 'countries',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
      fields: ['country_id'],
    });
  },
};
