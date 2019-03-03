const knex = require('../../services/knex');
const util = require('./util');
  
const name = 'users';

const columns = [
  'username',
  'password',
  'email',
  'token',
  'dateJoined',
];

const createTable = (schema) => {
  schema.increments();
  schema.string('username');
  schema.string('password');
  schema.string('email');
  schema.string('token', 1000);
  schema.dateTime('dateJoined');
};

const authenticate = async (username, password) => {
  try {
    const user = await search(username);
    const validPassword = await util.checkPassword(password, user.password);
    if (validPassword) {
      return user;
    } else{
      return null;
    }
  } catch (error) {
    throw error;
  }
};

const list = async () => {
  try {
    return await knex(name);
  } catch (error) {
    throw error;
  }
};

const search = async (searchValue) => {
  let users;
  let searchColumn = 'username';
  
  if (typeof searchValue === 'number') {
    searchColumn = 'id';
  }
  
  users = await knex('users').where(searchColumn, searchValue)

  if (users.length > 0) {
    return users[0];
  } else {
    throw `Unable to find user: ${searchValue}`;
  }
};

const create = async (request) => {
  const username = request.username;
  const password = request.password;
  const email = request.email;

  try {
    // check that username doesn't already exist
    await util.duplicateUserCheck(username);
  
    // hash user password
    const hashedPassword = await util.hashPassword(password);
    
    // create user object
    const user = {
      username: username,
      password: hashedPassword,
      email: email,
      dateJoined: new Date(),
    };

    // create jwt token;
    const token = util.generateToken(user);
    user.token = token;
    
    // save user to db
    await knex(name).insert(user);

    return user;
  } catch (error) {
    return error;
  }
};

const update = async (userId, requestBody) => {
  let payload = {};
  
  // copy valid user fields from request body
  Object.keys(requestBody).forEach(key => {
    if (columns.includes(key)) {
      payload[key] = requestBody[key];
    }
  });
  
  // update user in db
  try {
    return await knex(name).where({id: userId}).update(payload);
  } catch (error) {
    throw error;
  }
};

const remove = async (userId) => {
  try {
    await search(userId);
    await knex(name).where('id', userId).del();
    return;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  name: name,
  createTable: createTable,
  list: list,
  search: search,
  create: create,
  update: update,
  remove: remove,
  authenticate: authenticate,
};