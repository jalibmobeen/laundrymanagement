const User = require("../models/user.model");



exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find( {type:"user" });
    res.status(200).send({
      status: "success",
      data: users,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
