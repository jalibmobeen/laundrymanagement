var express = require('express');
const  connect = require('./config/db.config');
const cors = require("cors");
const passport = require('passport')
const { authRoutes, userRoutes, vendorRoutes } = require('./routes/index.routes');
const { getJwtStrategy } = require('./config/passport')
const globalError = require('./middlewares/globalError')
var app = express();
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
//prevent paramater pollution
app.use(hpp());
//stop headers attack
app.use(helmet());
//stop frm going hacker into html file using inline javascript
app.use(xss());
//stope no sql query injection
app.use(mongoSanitize());
//Global Middleware
app.use(express.json());

app.use(express.urlencoded({ extended: false, limit: "500mb" }));


const connectWithDB = async () => {
  try {
    await connect();
    console.log('Connection To Database Has Been Established');
  } catch (error) {
    console.log('There is some error in syncing models', error);
  }
}

connectWithDB();


app.use(cors({
  origin: "*"
}));




app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/vendor', vendorRoutes);

passport.use(getJwtStrategy())
app.use(globalError);

// app.use("*", (req, res, next) => {
//   req.status = 404;
//   const error = new Error("Route not found");
//   res.json({
//     message: error.message,
//     stack: error.stack,
//   });
//   next();
// });
module.exports = app;