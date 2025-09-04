const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

sequelize.sync({ alter: true })
  .then(() => console.log('Banco sincronizado'))
  .catch(err => console.error('Erro ao sincronizar o banco', err));

module.exports = sequelize;
