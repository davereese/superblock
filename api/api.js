const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');

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

// use api routes
app.use('/api', routes);

// catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

// get port from environment and set
const port = process.env.PORT || '3000';
app.set('port', port);

// create HTTP server
const server = http.createServer(app);

// start server
server.listen(port, () => console.log(`API running on localhost:${port}`));
