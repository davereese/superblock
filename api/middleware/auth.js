const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
  const token = req.headers['authorization'];
  const secretKey = require('../config').secretKey;
  
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

module.exports = router;