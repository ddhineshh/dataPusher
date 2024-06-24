const express = require('express');
const router = express.Router();
const Account = require('../models/accountEntity');
const Destination = require('../models/destinationEntity');
const axios = require('axios');

router.post('/', async (req, res) => {
  const secretToken = req.header('CL-X-TOKEN');

  if (!secretToken) {
    return res.status(401).json({ error: 'Un Authenticate' });
  }

  if (!req.is('application/json')) {
    return res.status(400).json({ error: 'Invalid Data' });
  }

  try {
    const account = await Account.findOne({ where: { secretToken } });
    if (!account) {
      return res.status(401).json({ error: 'Un Authenticate' });
    }

    const destinations = await Destination.findAll({ where: { AccountId: account.id } });

    for (const destination of destinations) {
      const headers = JSON.parse(destination.headers);
      const method = destination.httpMethod.toLowerCase();
      const url = destination.url;

      try {
        if (method === 'get') {
          await axios.get(url, { params: req.body, headers });
        } else if (method === 'post' || method === 'put') {
          await axios[method](url, req.body, { headers });
        }
      } catch (error) {
        console.error(`Error sending data to destination ${destination.id}:`, error.message);
      }
    }

    res.json({ message: 'Data processed successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
