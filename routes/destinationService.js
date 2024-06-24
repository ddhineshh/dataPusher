const express = require('express');
const router = express.Router();
const Destination = require('../models/destinationEntity');

router.post('/', async (req, res) => {
  try {
    const destination = await Destination.create({
            url: req.body.url,
            httpMethod: req.body.httpMethod,
            headers: req.body.headers,
            AccountId: req.body.AccountId
    });
    res.status(200).json({message : "Destination successfully created"});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findByPk(req.params.id);
    if (destination) {
      res.status(200).json(destination);
    } else {
      res.status(404).json({ error: 'Destination not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const destination = await Destination.findByPk(req.params.id);
    if (destination) {
      await destination.update(req.body);
      res.status(200).json(destination);
    } else {
      res.status(404).json({ error: 'Destination not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const destination = await Destination.findByPk(req.params.id);
    if (destination) {
      await destination.destroy();
      res.status(200).json({ message: 'Destination deleted successfully' });
    } else {
      res.status(404).json({ error: 'Destination not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
