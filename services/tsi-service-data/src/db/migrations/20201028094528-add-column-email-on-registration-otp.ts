/**
 * Description: Add `email` column on registration_otps table
 */

import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // FIXME:
    await queryInterface.addColumn('registration_otps', 'email', {
      type: DataTypes.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('registration_otps', 'email');
  },
};
