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
        defaultValue: 'customer'
    }
}, {
    tableName: 'users',
    timestamps: false,
    hooks: {
        async beforeCreate(user) {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        async beforeUpdate(user) {
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
