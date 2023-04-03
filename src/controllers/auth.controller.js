const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const generator = require("generate-password");
const { Op } = require("sequelize");
const { validateEmail } = require('../utils/validateEmail')
const ForgotPasswordToken = require('../models/forgotPasswordToken.model')
const { sendEmail,sendForgotPasswordEmail} = require("../utils/sendEmail");
const APIError = require("../utils/APIError.js");
const sequelize = require("sequelize");
const status = require('http-status')

exports.register = async (req, res) => {
  let { firstName, lastName, email, phone, country, city, gender, age, password, dob } =
    req.body;
  let profileImg = '';
  if (req.file != undefined) { profileImg = req.file.path }
  let sendMail = false;
  if (password == undefined) {
    password = generator.generate({
      length: 10,
      numbers: true,
    });
    sendMail = true;
  }
  try {
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      country,
      city,
      gender,
      age,
      profileImg: profileImg,
      password: bcrypt.hashSync(password, 8),
      dob,
    });
    if (sendMail == true) {
      user.isPasswordAuto = true;
      user.save();
      sendEmail(email, "One Time Password", password);
    }
    res.status(200).send({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    req.body.phone = req.body.phone == undefined ? "" : req.body.phone;
    const user = await User.findOne({
      attributes: [
        'id',
        'phone',
        'city',
        'country',
        'isActive',
        'firstName',
        'lastName',
        'gender',
        'age',
        'dob',
        'password',
        'email',
        'role',
        'profileImg',
      ],
      where: {
        [Op.or]: [
          sequelize.where(sequelize.fn('lower', sequelize.col('email')),
            sequelize.fn('lower', req.body.email)),
          { phone: req.body.phone }]
      },
    });

    if (validateEmail(req.body.email)) {
      if (!user) {
        return res.status(404).send({ message: "Incorrect Email Or Password!" });
      }
      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Incorrect Email Or Password!",
        });
      }
    } else {
      if (req.body.phone) {
        if (!user) {
          res.status(400).send({
            message: "Wrong phone number :(",
            phonenumber: req.body.phone,
          })
        }
      }
    }
    var token = user.getJWTToken();

    res.status(200).send({
      user: user,
      accessToken: token,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
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