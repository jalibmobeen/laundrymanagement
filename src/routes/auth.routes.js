const express = require("express");
const { checkDuplicateEmail} = require("../middlewares/verifySignUp");
const { Login, register, forgotPassword, resetPassword,updateVerifyStatus} = require("../controllers/auth.controller");

const authRouter = express.Router();
authRouter.route("/login").post(Login);
authRouter.route("/verifyEmail").post(updateVerifyStatus);
authRouter.route("/register").post( checkDuplicateEmail, register);
authRouter.route('/forgot-password').post(forgotPassword);
authRouter.route('/reset-password').post((resetPassword));

module.exports = authRouter;
