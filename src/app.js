var express = require('express');
const sequelize = require('./config/db.config');
const cors = require("cors");
const passport = require('passport')
const { authRoutes, userRoutes, vendorRoutes } = require('./routes/index.routes');
const { getJwtStrategy } = require('./config/passport')
const globalError = require('./middlewares/globalError')

var app = express();

app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: "500mb" }));


const connectWithDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection To Database Has Been Established');
  } catch (error) {
    console.log('There is some error in syncing models', error);
  }
}

connectWithDB();


app.use(cors({
  origin: "*"
}));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the beginnings of nothingness." });
});


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/vendor', vendorRoutes);

passport.use(getJwtStrategy())
app.use(globalError);


module.exports = app;