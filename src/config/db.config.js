const mongoose = require("mongoose")
const {DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME} = process.env;
const connect = ()=>{
  mongoose
  .connect(
   `mongodb+srv://Elaundary:laundary@cluster0.6jxpwxu.mongodb.net/`
  )
  .then(() => {
    console.log("db connection sucessfull");
  });
}

module.exports = connect;
