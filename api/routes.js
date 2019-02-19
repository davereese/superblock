const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const utilities = require('./utilities');
const Users = require('./models/users');

// ping test
router.get('/ping', (req, res) => {
  return res.status(200).json({ message: 'pong!' });
});

// authenticate
router.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  const [ user ] = await Users.search(username)
    .catch(error => utilities.returnError(res, error, 404));
  
  if (user) {
    const valid = await utilities.checkPassword(password, user.password);
    if (valid) {
      const payload = { username: user.username };
      const token = utilities.generateToken(payload);
      return res.status(200).json({ token: token });
    } else {
      return utilities.returnError(res, 'Invalid password', 401);
    }
  }
});

// add authentication middleware for all other routes
router.use((req, res, next) => {
  const token = req.headers['authorization'];
  const secretKey = require('./config').SECRET_KEY;
  
  if (token) {
    try {
      req.decoded = jwt.verify(token, secretKey);
      next();
    } catch (error) {
      return utilities.returnError(res, 'Invalid token', 401);
    }
  } else {
    return utilities.returnError(res, 'No token present in headers', 401);
  }
});

/* ENDPOINTS */

// users
router.get('/users', async (req, res) => {
  const users = await Users.list()
    .catch(error => {
      return utilities.returnError(res, error);
    });
  
  return res.status(200).json({ users: users });
});

router.post('/users', async (req, res) => {
  const token = await Users.create(req.body)
    .catch(error => {
      return utilities.returnError(res, error);
    });
  
  return res.status(200).json({ token: token });
});

module.exports = router;
