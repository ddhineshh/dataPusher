const Account = require('./accountEntity');
const Destination = require('./destinationEntity');
const sequelize = require('../config/database').sequelize;


Account.hasMany(Destination, { foreignKey: 'AccountId', onDelete: 'CASCADE' });
Destination.belongsTo(Account, { foreignKey: 'AccountId', onDelete: 'CASCADE' });

sequelize.sync({force: false}).then(function () {
    console.log("Database Configured");
});

module.exports = {
  Account,
  Destination,
};