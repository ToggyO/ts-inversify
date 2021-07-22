/**
 * Description: Add `status` column on password_resets table
 */

import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // FIXME:
    // await queryInterface.addColumn('password_resets', 'status', {
    //   type: DataTypes.TINYINT,
    //   allowNull: false,
    //   defaultValue: 0,
    // });
  },

  down: async (queryInterface: QueryInterface) => {
    // await queryInterface.removeColumn('password_resets', 'status');
  },
};
