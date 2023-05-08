const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
const { prepareOtpTemplate } = require('./../email_templates/otp_template');
const { prepareForgotPasswordTemplate } = require('./../email_templates/forgot_password');

exports.sendEmail = async(name, email,link) => {
 
  try {
    console.log(name, email)
    var Transport = new nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: false,
      auth: {
        user: "syedusamatanveer@gmail.com",
        pass: "rlflmngjkvqlclfo",
      },

    });

    var mail_options = {
      from: "syedusamatanveer@gmail.com",
      to: email,
      subject: `hi ${name}, plz verify this email account is yours `,
      html: `<a href='${link}'><button  style={{backgroundColor:'blue'}}>Verified Email</button></a>`,
    };
 let mail = await   Transport.sendMail(mail_options)
    console.log(mail);
    return mail;
  } catch (err) {
    console.log(err.message);
    return ;
  }
}

exports.sendForgotPasswordEmail = (email, subject, code) => {

  let transporter = nodemailer.createTransport(smtpTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  }));
  console.log(code);
  let mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: subject,
    html: prepareForgotPasswordTemplate(code)
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
    console.log(info)
  });

}