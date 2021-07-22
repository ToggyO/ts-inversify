/**
 * Description: Change field type from `varchar(255)` to `text` on
 * `profile_image` field on users table
 */

import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn('users', 'profile_image', {
      field: 'profile_image',
      type: DataTypes.TEXT,
      allowNull: true,
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn('users', 'profile_image', {
      field: 'profile_image',
      type: DataTypes.STRING,
      allowNull: true,
    });
  },
};
