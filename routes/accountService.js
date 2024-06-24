const express = require('express');
const router = express.Router();
const Account = require('../models/accountEntity');
const Destination = require('../models/destinationEntity');
const crypto = require('crypto');


router.post('/', async (req, res) => {
    try {

        const existingAccount = await Account.findOne({ where: { emailID: req.body.emailID } });
        if (existingAccount) {
        return res.status(400).json({ error: 'Email already exists' });
        }

      const secretToken = crypto.randomBytes(32).toString('hex');
      const account = await Account.create({
        emailID: req.body.emailID,
        name: req.body.name,
        secretToken,
        website: req.body.website
      });
      res.status(200).json({message:"Account succesfully created"});
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
});



router.get('/:id', async (req, res) => {
    try {
      const account = await Account.findByPk(req.params.id);
      if (account) {
        res.status(200).json(account);
      } else {
        res.status(404).json({ error: 'Account not found' });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
      const account = await Account.findByPk(req.params.id);
      if (account) {
        await account.update(req.body);
        res.status(200).json({message : `${account.name}'s account is succesfully updated`})
      } else {
        res.status(404).json({ error: 'Account not found' });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
      const account = await Account.findByPk(req.params.id);
      if (account) {
        await account.destroy();
        res.status.apply(200).json({ message: 'Account deleted successfully' });
      } else {
        res.status(404).json({ error: 'Account not found' });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
});


router.get('/:id/destinations', async (req, res) => {
    try {
      const destinations = await Destination.findAll({ where: { AccountId: req.params.id } });
      res.status(200).json(destinations);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  module.exports = router;


