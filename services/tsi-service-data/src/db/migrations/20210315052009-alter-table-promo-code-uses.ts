/**
 * Description: Change column `promoCodeId`, add foreign key to `promo_codes` on `promo_code_uses` table
 */

import { QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addConstraint('promo_code_uses', {
        fields: ['promo_code_id'],
        type: 'foreign key',
        name: 'promo_code_uses_promo_code_id_foreign',
        references: {
          table: 'promo_codes',
          field: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        transaction,
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }
  },

  down: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint('promo_code_uses', 'promo_code_uses_promo_code_id_foreign', {
        transaction,
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }
  },
};
