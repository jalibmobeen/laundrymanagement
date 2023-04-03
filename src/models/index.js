const User = require('./user.model');
const ForgotPasswordToken = require('./forgotPasswordToken.model');
const Vendor = require('./vendor');
require('./associations');

module.exports = {
    User,
    ForgotPasswordToken,
    Vendor
}

