const { db } = require('../db')
const { DataTypes, Model } = require('sequelize')
class Sauce extends Model {}
class Restaurant extends Model {}

Sauce.init(
  {
    name: DataTypes.STRING,
    image: DataTypes.STRING
  },
  {
    sequelize: db,
    timestamps: false
  }
)

Restaurant.init(
  {
    name: DataTypes.STRING,
    location: DataTypes.STRING
  },
  {
    sequelize: db,
    timestamps: false
  }
)

Restaurant.hasMany(Sauce)
Sauce.belongsTo(Restaurant)

module.exports = { Sauce, Restaurant }
