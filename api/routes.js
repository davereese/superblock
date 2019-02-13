const express = require('express');
const router = express.Router();
const utilities = require('./utilities');
const Users = require('./models/users');

// ping test
router.get('/ping', (req, res) => {
  return res.status(200).json({ message: 'pong!' });
});

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

// authenticate
router.post('/login', (req, res) => { });

// add authentication middleware for all other routes
router.use((req, res, next) => { });

module.exports = router;
