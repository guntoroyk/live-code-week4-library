'use strict';
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.Sequelize.Model;
  class Book extends Model {};

  Book.init({
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Title is required'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Description is required'
        }
      }
    },
    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Author is required'
        }
      }
    },
    availableToBorrow: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {sequelize});

  Book.associate = function(models) {
    // associations can be defined here
    Book.hasMany(models.Loan);
  };
  return Book;
};