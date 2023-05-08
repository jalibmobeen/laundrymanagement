
const mongoose = require("mongoose");
let orderSchema = new mongoose.Schema(
  {
    Price: {
      type: String
    },
    Status: {
      type: String
    },
    customerId: {
      type: Number
    },
    DateOfClaim: {
      type: Number
    },
    ProductName:{
      type:String
    }
  },
);

module.exports = mongoose.model("Order", orderSchema);
