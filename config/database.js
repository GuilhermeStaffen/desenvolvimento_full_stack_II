const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // ou configure MySQL/Postgres
  logging: false
});

module.exports = sequelize;