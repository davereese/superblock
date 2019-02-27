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
    return utilities.returnError(res, 'username and password are required', 400);
  }
  
  try {
    const user = await Users.create(req.body);
    return res.status(201).json(user);
  } catch (error) {
    return utilities.returnError(res, error);
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
      return utilities.returnError(res, 'invalid token', 401);
    }
  } else {
    return utilities.returnError(res, 'no token present in headers', 401);
  }
});

// middleware to convert userId to number if present
router.param('userId', (req, res, next) => {
  if (req.params.userId) {
    req.params.userId = Number(req.params.userId);
  }
  next();
});

// users
const USERS_ENDPOINT = '/users';

router.get(USERS_ENDPOINT, async (req, res) => {
  try {
    const users = await Users.list();
    return res.status(200).json(users);
  } catch (error) {
    return utilities.returnError(res, error);
  }
});

// TODO: query user endpoint

router.delete(`${USERS_ENDPOINT}/:userId`, async (req, res) => {
  const userId = req.params.userId;
  
  try {
    await Users.delete(userId);
    return res.status(202).send();
  } catch (error) {
    return utilities.returnError(res, error);
  }
});

module.exports = router;
