/**
 * Description: Add `total_price` column on itinerary_items table
 */

import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // FIXME:
    // await queryInterface.addColumn('itinerary_items', 'total_price', {
    //   field: 'total_price',
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // });
  },

  down: async (queryInterface: QueryInterface) => {
    // await queryInterface.removeColumn('itinerary_items', 'total_price');
  },
};
