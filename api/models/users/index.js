const knex = require('../../services/knex');
const util = require('./util');
  
const table = 'users';

const createTable = (schema) => {
  schema.increments();
  schema.string('username');
  schema.string('password');
  schema.string('email');
  schema.string('token');
  schema.dateTime('dateJoined');
}

const list = async () => {
  try {
    return await knex(table);
  } catch (error) {
    throw error;
  }
}

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
}

const create = async (request) => {
  const username = request.username;
  const password = request.password;
  const email = request.email;

  try {
    // check that username doesn't already exist
    await util.duplicateUserCheck(username)
  
    // hash user password
    const hashedPassword = await util.hashPassword(password)

    // create jwt token
    const payload = { user: username };
    const token = util.generateToken(payload);
    
    // create user object
    const user = {
      username: username,
      password: hashedPassword,
      email: email,
      token: token,
      dateJoined: new Date(),
    };
    
    // save user to db
    await knex(table).insert(user)

    return user;
  } catch (error) {
    return error;
  }
}

const update = async (userId) => {
  try {
    await search(userId);
    // todo
  } catch (error) {
    throw error;
  }
}

const remove = async (userId) => {
  try {
    await search(userId);
    await knex(table).where('id', userId).del();
    return;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  table: table,
  createTable: createTable,
  list: list,
  search: search,
  create: create,
  update: update,
  remove: remove,
}