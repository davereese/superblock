const knex = require('../../services/knex');
const util = require('./util');
  
const createTable = (table) => {
  table.increments();
  table.string('username');
  table.string('password');
  table.string('email');
  table.string('token');
  table.dateTime('dateJoined');
}

const list = async () => {
  try {
    return await knex('users');
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
    await knex('users').insert(user)

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
    await knex('users').where('id', userId).del();
    return;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createTable: createTable,
  list: list,
  search: search,
  create: create,
  update: update,
  remove: remove,
}