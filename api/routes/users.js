const express = require('express');
const router = express.Router();
const users = require('../models/users');

// middleware to convert userId to number if present
router.param('userId', (req, res, next) => {
  if (req.params.userId) {
    req.params.userId = Number(req.params.userId);
  }
  next();
});

/* USERS */
const USERS_ENDPOINT = '/users';

// list
router.get(USERS_ENDPOINT, async (req, res) => {
  try {
    return res.status(200).json(await users.list());
  } catch (error) {
    return res.status(500).send(error);
  }
});

// search
router.get(`${USERS_ENDPOINT}/:userId`, async (req, res) => {
  const userId = req.params.userId;
  
  try {
    const user = await users.search(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).send(error);
  }
});

// update
router.put(`${USERS_ENDPOINT}/:userId`, async (req, res) => {
  const userId = req.params.userId;

  try {
    await users.update(userId, req.body);
    return res.status(202).send();
  } catch (error) {
    return res.status(400).json(error);
  }
});

// delete
router.delete(`${USERS_ENDPOINT}/:userId`, async (req, res) => {
  const userId = req.params.userId;
  
  try {
    await users.remove(userId);
    return res.status(202).send();
  } catch (error) {
    return res.status(400).send(error);
  }
});

module.exports = router;