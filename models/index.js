const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');

async function syncDatabase() {
  try {
    await sequelize.sync(); 
  } catch (error) {
    console.error('Erro ao sincronizar DB:', error);
  }
}

module.exports = { sequelize, User, Product, syncDatabase }