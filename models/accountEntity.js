const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const axios = require('axios');
const Destination = require('./destinationEntity');

const Account = sequelize.define('Accounts', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  emailID: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  secretToken: {
    type: DataTypes.STRING,
    allowNull: false
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  hooks: {
    afterCreate: async (account) => {
      await sendWebhooks(account, 'created');
    },
    afterUpdate: async (account) => {
      await sendWebhooks(account, 'updated');
    },
    beforeDestroy: async (account) => {
      await sendWebhooks(account, 'deleted');
    }
  }
});

async function sendWebhooks(account, action) {
  try {
    const destinations = await Destination.findAll({ where: { AccountId: account.id } });
    for (const destination of destinations) {
      const headers = destination.headers;
      headers['ACTION'] = action;

      try {
        if (destination.httpMethod.toLowerCase() === 'get') {
          await axios.get(destination.url, { params: account.toJSON(), headers });
        } else {
          await axios[destination.httpMethod.toLowerCase()](destination.url, account.toJSON(), { headers });
        }
      } catch (error) {
        console.error(`Error sending webhook to destination ${destination.id}:`, error.message);
      }
    }
  } catch (error) {
    console.error('Error fetching destinations:', error.message);
  }
}

module.exports = Account;
