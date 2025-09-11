const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    defaultValue: "",
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
    async beforeCreate(product, options) {
      if (options.userId) {
        product.createdBy = options.userId;
        product.updatedBy = options.userId;
      }
    },
    async beforeUpdate(product, options) {
      if (options.userId) {
        product.updatedBy = options.userId;
      }
    }
  }
});

module.exports = Product;
