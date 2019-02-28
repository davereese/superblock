const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const knex = require('./services/knex');
const secretKey = require('./config').SECRET_KEY;

exports.generateToken = (payload) => {
  return jwt.sign(payload, secretKey);
}

exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
}

exports.checkPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
}

exports.duplicateUserCheck = async (username) => {
  const matchingUsers = await knex('users').where('username', username);
  
  if (matchingUsers.length > 0) {
    throw 'Username already exists';
  }
}