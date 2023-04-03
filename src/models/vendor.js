const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

class Vendor extends Model {
  static associate(models) {
    // define association here
  }
}

Vendor.init(
  {
      name:{
        type: DataTypes.STRING,
      },
      address:{
        type: DataTypes.STRING,
      }
 },
  {
    sequelize,
    modelName: "Vendor",
  }
);

module.exports = Vendor;
