
const User = require('../models/user.model');
const APIError = require('../utils/APIError');
const { logger } = require("../utils/logger")
exports.checkDuplicateEmail = async (req, res, next) => {
  try {
    // Email
    let user = await User.findOne({
      email: req.body.email
    })
    logger().info("checking email duplication", user)
    if(user){
      const error = new APIError("User of that email is already exist", 409)
      res.json({ message: error.message, status: 409 })
    }
    next();
  }
  catch (err) {
    res.json({ message: err.message, status: 500 })
  }
};

