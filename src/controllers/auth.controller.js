const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const generator = require("generate-password");

const { validateEmail, isEmailVerified } = require('../utils/validateEmail')
const { issueJwt } = require("../utils/handlejwt")
const ForgotPasswordToken = require('../models/forgotPasswordToken.model')
const { sendEmail, sendForgotPasswordEmail } = require("../utils/sendEmail");
const APIError = require("../utils/APIError.js");
const jwt = require("jsonwebtoken")
const status = require('http-status')
const { logger } = require("../utils/logger");
exports.register = async (req, res) => {

  try {
    let { firstName, lastName, email, type, phone, country, city, gender, age, password, dob } =
      req.body;
    logger().info(`body response ${JSON.stringify(req.body)}`);
    if (!type) { type = "user"; }
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      country,
      city,
      type,
      gender,
      age,
      password: bcrypt.hashSync(password.toString(), 10),
      dob,
      isEmailVerified: false
    });
    if (password) {
      user.save();
      logger().info(`user registered`);
      let mailResponse = await sendEmail(firstName, email, "https://jazzy-stardust-7bee5b.netlify.app/dashboard");
      if (!mailResponse) {
        const error = new APIError("Error in sending verification mail", 403);
        res.json({
          message: error.message,
          stack: error.stack,
          status: 403
        });

      }
      res.json({
        status: "success",
        data: user,
      });
    }
  } catch (error) {
    res.json({ message: error.message, status: 500 });
  }
};

exports.Login = async (req, res) => {
  try {
    logger().info("request body at login",JSON.stringify(req.body))
    const { email, password } = req.body;
    console.log("consoling email and password:", email, password);
    if (validateEmail(email) && password) {
      const user = await User.findOne({ email });
      logger().info(`getting user of that email ${user}`)
      if (user) {
        const verify = await bcrypt.compare(password.toString(), user.password);
        logger().info(`verified email ${verify}`)
        var verifiedEmail = await isEmailVerified(email);
        if (verify&&verifiedEmail) {
          const token = await issueJwt(user);
          logger().info(`response of jwt token ${token}`)
          if (!token.message) {
            res.status(201).json({
              user: user,
              token: token,
            });
          }
        } else {
          const error = new APIError("Incorrect Password!", status.FORBIDDEN);
          res.status(502).json({
            message: error.message,
            stack: error.stack,
          });
        }
      } else {
        const error = new APIError("User does not exist", status.NOT_FOUND);
        res.status(404).json({
          message: error.message,
          stack: error.stack,

        });

      }
    } else {
      const error = new APIError("Incorrect Email Or Password!", status.FORBIDDEN);
      res.status(403).json({
        message: error.message,
        stack: error.stack,
        status: 403,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateVerifyStatus = async (req, res) => {
  // Email
  try {
    let user = await User.findOneAndUpdate({
      email: req.body.email
    }, { isEmailVerified: true }, {
      new: true
    });
    if (user) {
      res.json({ user: user, message: "userVerfied", status: 201 });
    } else {
      res.json({
        message: "Error in verifying user", status: 403
      });
    }

  } catch (error) {
    res.json({ message: error.message, status: 500 });
  }

};
exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body

  const user = await User.findOne({
    where: {
      email,
    },
    include: [ForgotPasswordToken],
  })
  if (!user)
    return next(
      new APIError(
        'No User found with the email address',
        status.BAD_REQUEST
      )
    )

  const token = await user.generateForgotPasswordToken(user.id, 2)
  const subject = 'Forgot Password'

  sendForgotPasswordEmail(user.email, subject, token);

  res.status(status.CREATED).json({
    status: 'success',
    reset_token: token,
  });
}

exports.resetPassword = async (req, res, next) => {
  const { email, password, token } = req.body

  const hashedToken = User.createHashFromString(token)

  const user = await User.findOne({
    include: [
      {
        model: ForgotPasswordToken,
        where: {
          token: hashedToken,
          expiresIn: {
            [Op.gte]: Date.now(),
          },
        },
      },
    ],
  })

  if (!user)
    return next(
      new APIError('Your session has been expired!', status.UNAUTHORIZED)
    )

  user.password = bcrypt.hashSync(password, 8)
  await user.ForgotPasswordToken.destroy()

  await user.save()

  res.status(status.OK).json({
    status: 'success',
  })
}