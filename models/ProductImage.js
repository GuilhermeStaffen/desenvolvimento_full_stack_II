const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./Product');

const ProductImage = sequelize.define('ProductImage', {
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'product_images',
  timestamps: true
});

// Relationships are defined in models/index.js to avoid circular dependencies

module.exports = ProductImage;
