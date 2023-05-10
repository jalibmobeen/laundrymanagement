const express = require("express");
const { authJwt } = require('../middlewares/authJwt')
const { getAllUsers } = require("../controllers/user.controller");
const userRouter = express.Router();

userRouter.use(authJwt);
//Token will be check here using middleware named 'authJwt' before executing code of following route methods


userRouter.route("/getUsers").get(getAllUsers);
module.exports = userRouter;
