/**
 * Description: Add `itinerary_date` column on itinerary_items table
 */

import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // FIXME:
    await queryInterface.addColumn('itinerary_items', 'itinerary_date', {
      field: 'itinerary_date',
      type: DataTypes.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('itinerary_items', 'itinerary_date');
  },
};
