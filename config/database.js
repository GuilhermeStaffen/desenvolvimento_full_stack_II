const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.NODE_ENV === 'production' ? ':memory:' : './database.sqlite',
  logging: false
});

module.exports = sequelize;