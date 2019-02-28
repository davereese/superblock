const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const utilities = require('./utilities');
const Users = require('./models/users');

// ping test
router.get('/ping', (req, res) => {
  return res.status(200).json('pong!');
});

// user login
router.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  try {
    const user = await Users.search(username);
    const validPassword = await utilities.checkPassword(password, user.password);
    if (validPassword) {
      return res.status(200).json(user);
    } else{
      return res.status(401).json('failed to validate password');
    }
  } catch (error) {
    return res.status(404).json(error);
  }
});

// create new user
router.post('/users', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json('username and password are required');
  }
  
  try {
    const user = await Users.create(req.body);
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// add authentication middleware for all other routes
router.use((req, res, next) => {
  const token = req.headers['authorization'];
  const secretKey = require('./config').SECRET_KEY;
  
  if (token) {
    try {
      req.user = jwt.verify(token, secretKey);
      next();
    } catch (error) {
      return res.status(401).json('invalid token');
    }
  } else {
    return res.status(401).json('no token present in headers');
  }
});

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
    const users = await Users.list();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// search
router.get(`${USERS_ENDPOINT}/:userId`, async (req, res) => {
  const userId = req.params.userId;
  
  try {
    const user = await Users.search(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json(error);
  }
});

// update
router.put(`${USERS_ENDPOINT}/:userId`, async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await Users.search(userId);
  } catch (error) {

  }
});

// delete
router.delete(`${USERS_ENDPOINT}/:userId`, async (req, res) => {
  const userId = req.params.userId;
  
  try {
    await Users.remove(userId);
    return res.status(202).send();
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
