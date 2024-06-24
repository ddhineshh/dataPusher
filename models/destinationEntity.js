const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Account = require('./accountEntity');

const Destination = sequelize.define('Destination', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  httpMethod: {
    type: DataTypes.STRING,
    allowNull: false
  },
  headers: {
    type: DataTypes.JSON,
    allowNull: false
  },
  AccountId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Accounts',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
});


module.exports = Destination;
