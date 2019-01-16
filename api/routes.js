const express = require('express');
const router = express.Router();
const utilties = require('./utilities');

// connect to postgres

// new users
router.post('/users', async (req, res) => {});

// authenticate
router.post('/login', (req, res) => {});

// add authentication middleware for all other routes
router.use((req, res, next) => {});

module.exports = router;
