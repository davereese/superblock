// vendor
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
// controllers
const statusController = require('./controllers/status');
const loginController = require('./controllers/login');
const usersController = require('./controllers/users');
// middleware
const authMiddleware = require('./middleware/auth');
// services
const knex = require('./services/knex');
// models
const users = require('./models/users');


// init express
const app = express();

// setup CORS for local development
app.use(cors({
  origin: 'http://localhost:3000'
}));

// parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// point static path to build
app.use(express.static(path.join(__dirname, '../build')));

// configure router
app.use('/api', [
  statusController,
  loginController,
  authMiddleware,
  usersController,
]);

// catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

// get port from environment and set
const port = process.env.SUPERBLOCK_PORT || '4000';
app.set('port', port);

// create HTTP server
const server = http.createServer(app);

// start server
server.listen(port, async () => {
  console.log(`API running on localhost:${port}`);
  
  // on server load, create users table if necessary
  const exists = await knex.schema.hasTable(users.name);
  if (!exists) {
    await knex.schema.createTable(users.name, schema => {
        users.createTable(schema);
    });
  }
});
