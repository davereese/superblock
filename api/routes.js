const express = require('express');
const router = express.Router();
const utilties = require('./utilities');
const config = require('./config');

// connect to postgres
const knex = require('knex')(config.knexConfig);

// ping test
router.get('/ping', (req, res) => {
    res.status(200).json({message: 'pong!'});
});

// users
router.get('/users', async (req, res) => {
    const users = await knex.select().table('users').catch(error => console.log(error));
    res.status(200).json({users: users});
});

router.post('/users', async (req, res) => {
    const hashedPassword = await utilties.hashPassword(req.body.password)
        .catch(error => res.status(500).json({message: 'Failed to hash user password'}));
    const user = {
        username: req.body.username,
        password: hashedPassword,
    };
    await knex('users').insert(user).catch(error => console.log(error));
    res.status(200).json({message: 'success!'});
});

// authenticate
router.post('/login', (req, res) => {});

// add authentication middleware for all other routes
router.use((req, res, next) => {});

module.exports = router;
