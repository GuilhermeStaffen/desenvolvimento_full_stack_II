const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const Cart = require('./Cart');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const ProductImage = require('./ProductImage');
const Supplier = require('./Supplier');

function applyAssociations() {
  User.hasMany(Order, { foreignKey: 'userId' });
  Order.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  User.hasMany(Cart, { foreignKey: 'userId' });
  Cart.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  Product.hasMany(Cart, { foreignKey: 'productId' });
  Cart.belongsTo(Product, {
    foreignKey: 'productId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  Order.hasMany(OrderItem, { foreignKey: 'orderId' });
  OrderItem.belongsTo(Order, {
    foreignKey: 'orderId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  Product.hasMany(OrderItem, { foreignKey: 'productId' });
  OrderItem.belongsTo(Product, {
    foreignKey: 'productId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  Product.hasMany(OrderItem, { foreignKey: "productId" });
  OrderItem.belongsTo(Product, { foreignKey: "productId" });

  Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });
  ProductImage.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

  Supplier.hasMany(Product, { foreignKey: 'supplierId', as: 'products' });
  Product.belongsTo(Supplier, { foreignKey: 'supplierId', as: 'supplier' });
}



async function syncDatabase() {
  try {
    await sequelize.sync({});
    console.log('Banco sincronizado com sucesso!');
  } catch (error) {
    console.error('Erro ao sincronizar DB:', error);
  }
}

module.exports = { sequelize, User, Product, Cart, Order, OrderItem, ProductImage, syncDatabase, applyAssociations, Supplier };
