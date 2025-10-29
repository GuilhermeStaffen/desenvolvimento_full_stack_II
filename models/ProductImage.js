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

Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

module.exports = ProductImage;
