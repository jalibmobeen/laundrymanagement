const { Op } = require("sequelize");
const { User, Vendor } = require("../models");

exports.registerVendor = async (req, res) => {
    try {
        let { name,address } = req.body;
        const getVendor = await Vendor.findOne({
          where: {
            name
          },
        });
        if (getVendor) {
            return res.status(400).json({
              status: "failed",
              error: true,
              data: {
                message: "Vendor already exists",
              },
            });
          }
    
       const vendor= await Vendor.create({
            name,address
        });
        return res.status(200).json({
          status: "success",
          error: false,
          data: {
            message :"Account register successfully",
            vendor
        },
        });
      } catch (error) {
        return res.status(500).json({
          status: "failed",
          error: true,
          data: {
            message: error.message,
          },
        });
      }





}
exports.getAllVendors = async (req, res) => {
  try {
    const allVendors = await Vendor.findAll({
    });

    return res.status(200).json({
      status: "success",
      error: false,
      data: {
        allVendors
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      error: true,
      data: {
        message: error.message,
      },
    });
  }
};
exports.vendorDetails = async (req, res) => {
    const {vendorId} = req.params
    try {
      const vendor = await Vendor.findOne({
        where:{
            id:vendorId
        }
      });
      if(!vendor)
      {
        return res.status(404).json({
            status: "fail",
            error: true,
            data: {
              message:"no vendor found"
            },
          });
      }
      return res.status(200).json({
        status: "success",
        error: false,
        data: {
            vendor
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        error: true,
        data: {
          message: error.message,
        },
      });
    }
  };
