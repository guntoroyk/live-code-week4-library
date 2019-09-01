'use strict';
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.Sequelize.Model;
  class Loan extends Model {};

  Loan.init({
    borrowerName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: `Borrower's name is required`
        }
      }
    },
    borrowerGender: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: `Borrower's gender is required`
        }
      }
    },
    dueDate: DataTypes.DATE,
    returned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    BookId: { 
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: `Book is required`
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: (loan) => {
        sequelize.models.Book.update({
          availableToBorrow: false
        }, {where: {id: loan.dataValues.BookId}});
        // console.log('dari before create')
        // console.log(loan.dataValues.BookId)
      }
    },
    sequelize});

  Loan.associate = function(models) {
    // associations can be defined here
    Loan.belongsTo(models.Book);
  };
  return Loan;
};