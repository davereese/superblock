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
  schema.specificType('blocks', 'integer ARRAY');
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
  
  users = await knex('users').where(searchColumn, searchValue);

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
    const newUser = await knex(name).insert(user, [
      'id', 'username', 'password', 'email', 'token'
    ]);

    return newUser[0];
  } catch (error) {
    throw error;
  }
};

const update = async (userId, requestBody) => {
  let payload = {
    username: requestBody.username,
    password: requestBody.password,
    email: requestBody.email,
  };
  
  // update user in db
  try {
    return await knex(name).where({id: userId}).update(payload);
  } catch (error) {
    throw error;
  }
};

const hasBlock = async (userId, blockId) => {
  try {
    const user = await knex(name)
      .first('blocks')
      .where({id: userId});
    
    return user.blocks.includes(blockId);
  } catch (error) {
    return error;
  }
};

const addBlock = async (userId, blockId) => {
  try {
    const usersBlocks = await knex(name)
      .where({id: userId})
      .first('blocks')
      .then((row) => {
        return row.blocks !== null ? row.blocks : [];
      });

    usersBlocks.push(blockId);

    await knex(name)
      .where({id: userId})
      .update({blocks: usersBlocks});
  } catch (error) {
    return error;
  }
};

const removeBlock = async (userId, blockId) => {
  try {
    const usersBlocks = await knex(name)
      .where({id: userId})
      .first('blocks')
      .then((row) => {
        return row.blocks !== null ? row.blocks : [];
      });

    const index = usersBlocks.indexOf(blockId);
    usersBlocks.splice(index, 1);

    await knex(name)
      .where({id: userId})
      .update({blocks: usersBlocks});
  } catch (error) {
    return error;
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
  addBlock: addBlock,
  hasBlock: hasBlock,
  removeBlock: removeBlock,
  authenticate: authenticate,
};