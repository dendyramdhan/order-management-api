'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products', [
      {
        name: 'Apple iPhone 13',
        price: 99900,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Samsung Galaxy S21',
        price: 79900,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Google Pixel 6',
        price: 59900,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'OnePlus 9 Pro',
        price: 72900,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Sony WH-1000XM4 Headphones',
        price: 34900,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Dell XPS 13 Laptop',
        price: 129900,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Apple MacBook Pro 16-inch',
        price: 239900,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Nintendo Switch',
        price: 29900,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Sony PlayStation 5',
        price: 49900,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Microsoft Xbox Series X',
        price: 49900,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
