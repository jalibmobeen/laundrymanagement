const { Model, DataTypes } = require('sequelize')
const sequelize = require("../config/db.config");

class ForgotPasswordToken extends Model {}

ForgotPasswordToken.init(
    {
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expiresIn: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'ForgotPasswordToken',
    }
)

module.exports = ForgotPasswordToken
