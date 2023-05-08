const express = require("express");
const { authJwt } = require('../middlewares/authJwt')
const { registerVendor, getAllVendors, vendorDetails } = require("../controllers/vendor.controller");

const vendorRouter = express.Router();

vendorRouter.use(authJwt);
//Token will be check here using middleware named 'authJwt' before executing code of following route methods

vendorRouter.route("/register").get(registerVendor );
vendorRouter.route("/allvendors").get(getAllVendors );
vendorRouter.route("/vendorDetails/:id").get(vendorDetails );

module.exports = vendorRouter;
