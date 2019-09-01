'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
   return queryInterface.bulkInsert('Books', [
      {
        title: 'Book 1',
        description: 'description 1',
        author: 'igun',
        createdAt: new Date(),
        updatedAt: new Date()
      }, 
      {
        title: 'Book 2',
        description: 'description 2',
        author: 'igun',
        createdAt: new Date(),
        updatedAt: new Date()
      }, 
      {
        title: 'Book 3',
        description: 'description 3',
        author: 'igun',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
