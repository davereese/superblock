const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.generateToken = (payload) => {
  const secret = process.env.SUPERBLOCK_SECRET;
  return jwt.sign(payload, secret);
}

exports.hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return Promise.resolve(hashedPassword);
}

exports.checkPassword = async (password, hash) => {
  const valid = await bcrypt.compare(password, hash);
  if (valid) {
    return Promise.resolve(true);
  } else {
      return Promise.reject(false);
  }
}