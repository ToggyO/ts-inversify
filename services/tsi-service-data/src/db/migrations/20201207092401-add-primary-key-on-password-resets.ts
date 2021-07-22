/**
 * Description: Add primary key column on password_resets table
 */

import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // FIXME:
    // await queryInterface.addColumn('password_resets', 'id', {
    //   type: DataTypes.INTEGER,
    //   autoIncrement: true,
    //   primaryKey: true,
    // });
  },

  down: async (queryInterface: QueryInterface) => {
    // await queryInterface.removeColumn('password_resets', 'id');
  },
};
