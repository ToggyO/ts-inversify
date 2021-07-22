/**
 * Description: Remove `itinarary_date` column on itineraries table
 */

import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // FIXME:
    await queryInterface.removeColumn('itineraries', 'itinarary_date');
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('itineraries', 'itinerary_date', {
      field: 'itinerary_date',
      type: DataTypes.DATE,
      allowNull: true,
    });
  },
};
