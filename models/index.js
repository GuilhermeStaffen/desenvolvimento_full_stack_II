const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const Cart = require('./Cart');

async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Banco sincronizado com sucesso!');
  } catch (error) {
    console.error('Erro ao sincronizar DB:', error);
  }
}

module.exports = { sequelize, User, Product, Cart, syncDatabase };