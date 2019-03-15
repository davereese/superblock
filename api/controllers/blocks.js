const express = require('express');
const router = express.Router();
const blocks = require('../models/blocks');
const users = require('../models/users');

const endpoint = '/blocks';

// create new block
router.post(endpoint, async (req, res) => {
  if (!req.body.content) {
    return res.status(400).json('block content required');
  }
  
  try {
    // save block to db
    const block = await blocks.create(req.body);

    // save block's ID to user
    await users.addBlock(req.user, block.id);

    return res.status(201).json(block);
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;