const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const Cart = require('./Cart');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const ProductImage = require('./ProductImage');

Order.belongsTo(User);
User.hasMany(Order);

Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

Product.hasMany(OrderItem, { foreignKey: "productId" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });

Product.hasMany(ProductImage, { foreignKey: "productId" });
ProductImage.belongsTo(Product, { foreignKey: "productId" });

async function syncDatabase() {
  try {
    await sequelize.sync({});
    console.log('Banco sincronizado com sucesso!');
  } catch (error) {
    console.error('Erro ao sincronizar DB:', error);
  }
}

module.exports = { sequelize, User, Product, Cart, Order, OrderItem, ProductImage, syncDatabase };
