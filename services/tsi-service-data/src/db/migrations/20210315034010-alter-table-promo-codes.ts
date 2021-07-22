/**
 * Description: Rename column `geneartion_type` to `generation_type`
 */

import { QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // FIXME:
    await queryInterface.renameColumn('promo_codes', 'geneartion_type', 'generation_type');
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.renameColumn('promo_codes', 'generation_type', 'geneartion_type');
  },
};
