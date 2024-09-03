'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products', [
      {
        name: 'Product 1',
        price: 10000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Product 2',
        price: 20000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Product 3',
        price: 30000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
