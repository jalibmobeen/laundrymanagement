
const mongoose = require("mongoose");

let paymentSchema = new mongoose.Schema(
  {
    paymentId: {
      type: Number,
    },
    OrderId: {
      type: Number
    },
    customerId: {
      type: Number
    },
    Date:{
      type:String
    },
    Amount: {
      type: String
    },
    Status: {
      type: String
    }
  },
);

module.exports = mongoose.model("Payment", paymentSchema);
