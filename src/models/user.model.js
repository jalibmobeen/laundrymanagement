
const mongoose = require("mongoose");

let userSchema = new mongoose.Schema(
  {
    firstName: {
      type:String
    },
    lastName: {
      type:String
    },
    email: {
      type:String,
      unique:true,
    },
    phone: {
        type:String,
        unique:true,
    },
    country: {
      type: String
    },
    city: {
      type: String,
    },
    gender: {
      type: String,
    },
    password: {
      type: String
    },
    type: {
      type: String,
    },
    isEmailVerified:{
      type:Boolean,
    },
    age: {
      type: Number,
    },
    dob: {
      type: String,
    }
  },
);

module.exports =  mongoose.model("User",userSchema);
