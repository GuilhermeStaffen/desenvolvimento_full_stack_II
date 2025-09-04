const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'products',
  timestamps: true,
  hooks: {
    async beforeCreate(user, options) {
      if (options.userId) {
        user.createdBy = options.userId;
        user.updatedBy = options.userId;
      }
    },
    async beforeUpdate(user, options) {
      if (options.userId) {
        user.updatedBy = options.userId;
      }
    }
  }
});

module.exports = Product;
