const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
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
    userType: {
        type: DataTypes.ENUM('customer', 'admin'),
        allowNull: false,
        defaultValue: 'customer'
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    street: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    number: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    zipcode: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    }
}, {
    tableName: 'users',
    timestamps: true,
    hooks: {
        async beforeCreate(user, options) {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        async beforeUpdate(user, options) {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

User.prototype.checkPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = User;
