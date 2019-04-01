const express = require('express');
const router = express.Router();
const blocks = require('../models/blocks');
const users = require('../models/users');

const endpoint = '/blocks';

// create new block
router.post(endpoint, async (req, res) => {
  if (!req.body.content) {
    return res.status(400).send('Block content required');
  }
  
  try {
    // save block to db
    const block = await blocks.create(req.body);

    // save block's ID to user
    await users.addBlock(req.user.id, block.id);

    return res.status(201).json(block);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// get single block
router.get(`${endpoint}/:blockId`, async (req, res) => {
  const blockId = parseInt(req.params.blockId);
  const username = req.user.username;
  const userId = req.user.id;
  
  try {
    // check to make sure current user has this id assigned to them
    const userHasBlock = await users.hasBlock(userId, blockId);

    if (userHasBlock) {
      const block = await blocks.get(blockId);
      res.status(200).json(block);
    } else {
      throw `That block does not belong to ${username}`;
    }
  } catch (error) {
    res.status(404).send(error);
  }
});

// update
router.put(`${endpoint}/:blockId`, async (req, res) => {
  const blockId = parseInt(req.params.blockId);
  const username = req.user.username;
  const userId = req.user.id;

  try {
    // check to make sure current user has this id assigned to them
    const userHasBlock = await users.hasBlock(userId, blockId);

    if (userHasBlock) {
      const block = await blocks.update(blockId, req.body);
      res.status(200).json(block);
    } else {
      throw `That block does not belong to ${username}`;
    }
  } catch (error) {
    res.status(404).send(error);
  }
});

// delete
router.delete(`${endpoint}/:blockId`, async (req, res) => {
  const blockId = parseInt(req.params.blockId);
  const username = req.user.username;
  const userId = req.user.id;

  try {
    // check to make sure current user has this id assigned to them
    const userHasBlock = await users.hasBlock(userId, blockId);

    if (userHasBlock) {
      await blocks.delete(blockId);
      // remove block's ID from user
      await users.removeBlock(username, blockId);
      res.status(202).send();
    } else {
      throw `That block does not belong to ${username}`;
    }
  } catch (error) {
    res.status(404).send(error);
  }
});

module.exports = router;