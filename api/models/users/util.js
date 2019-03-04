const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const knex = require('../../services/knex');


const generateToken = (payload) => {
  const secretKey = require('../../config').secretKey;
  return jwt.sign(payload, secretKey);
}

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
}

const checkPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
}

const duplicateUserCheck = async (username) => {
  const name = require('./index').name;
  const matchingUsers = await knex(name).where('username', username);
  
  if (matchingUsers.length > 0) {
    throw 'username already exists';
  }
}

module.exports = {
  generateToken: generateToken,
  hashPassword: hashPassword,
  checkPassword: checkPassword,
  duplicateUserCheck: duplicateUserCheck,
}