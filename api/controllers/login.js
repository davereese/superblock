const express = require('express');
const users = require('../models/users');
const router = express.Router();


// user login
router.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  try {
    const user = await users.authenticate(username, password);
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(401).json('failed to validate password');
    }
  } catch (error) {
    return res.status(404).send(error);
  }
});

// create new user
router.post('/users', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json('username and password are required');
  }
  
  try {
    const user = await users.create(req.body);
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
