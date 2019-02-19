const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const defaultErrorCode = require('./config').DEFAULT_ERROR_CODE;

exports.generateToken = (payload) => {
  const secret = process.env.SUPERBLOCK_SECRET;
  return jwt.sign(payload, secret);
}

exports.hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return Promise.resolve(hashedPassword);
}

exports.checkPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash)
    .catch(() => Promise.reject(false))
}

exports.returnError = (response, error, code=defaultErrorCode) => {
  return response.status(code).json({ message: error });
}