/**
 * Description: Add `isBlocked` column on users table
 */

import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // FIXME:
    await queryInterface.addColumn('users', 'is_blocked', {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('users', 'is_blocked');
  },
};
