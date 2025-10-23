const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

const Supplier = sequelize.define('Supplier', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    cnpj: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'suppliers',
    timestamps: true,
    hooks: {
        async beforeCreate(product, options) {
            if (options.userId) {
                product.createdBy = options.userId;
                product.updatedBy = options.userId;
            }
        },
        async beforeUpdate(product, options) {
            if (options.userId) {
                product.updatedBy = options.userId;
            }
        }
    }
});


module.exports = Supplier;
