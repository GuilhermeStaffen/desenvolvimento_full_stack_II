const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Order = sequelize.define('Order', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: User, key: 'id' }
    },
    status: {
        type: DataTypes.ENUM('placed', 'shipped', 'delivered', 'canceled'),
        defaultValue: 'placed',
        allowNull: false
    },
    fullAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    total: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    tableName: 'orders',
    timestamps: true
});

module.exports = Order;