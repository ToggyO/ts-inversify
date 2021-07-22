/**
 * Description: Add `topDestination` and `topToVisit` columns on cities table
 */

import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // FIXME:
    await queryInterface.addColumn('cities', 'top_destination', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('cities', 'top_to_visit', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('cities', 'top_destination');
    await queryInterface.removeColumn('cities', 'top_to_visit');
  },
};
