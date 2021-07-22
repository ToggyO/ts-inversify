/**
 * Description: Add `expire_at` column on itineraries table
 */

import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // FIXME:
    await queryInterface.addColumn('itineraries', 'expire_at', {
      field: 'expire_at',
      type: DataTypes.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('itineraries', 'expire_at');
  },
};
