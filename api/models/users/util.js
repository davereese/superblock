const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const knex = require('../../services/knex');
const secretKey = require('../../config').SECRET_KEY;

const generateToken = (payload) => {
  return jwt.sign(payload, secretKey);
}

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
}

const checkPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
}

const duplicateUserCheck = async (username) => {
  const matchingUsers = await knex('users').where('username', username);
  
  if (matchingUsers.length > 0) {
    throw 'Username already exists';
  }
}

module.exports = {
  generateToken: generateToken,
  hashPassword: hashPassword,
  checkPassword: checkPassword,
  duplicateUserCheck: duplicateUserCheck,
}