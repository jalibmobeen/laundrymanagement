
const mongoose = require("mongoose");

let paymentSchema = new mongoose.Schema(
  {
    customerId: {
      type: String
    },
    transactionId: {
      type: String
    },
     orderId: {
      type: String
    }

  },
);

module.exports = mongoose.model("Payment", paymentSchema);
