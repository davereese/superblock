const knex = require('../services/knex').knex;
const utilities = require('../utilities');

module.exports = class Users {
  
  static async list() {
    const users = await knex.select().table('users')
      .catch(() => Promise.reject('Failed to get users from db'));
    
    return Promise.resolve(users);
  }

  static async create(request) {
    const username = request.username;
    const password = request.password;
    
    // hash user password
    const hashedPassword = await utilities.hashPassword(password)
      .catch(() => Promise.reject('Failed to hash user password'));

    // create user object
    const user = {
      username: username,
      password: hashedPassword,
      dateJoined: new Date(),
    };
    
    // save user to db
    await knex('users').insert(user)
      .catch(() => Promise.reject('Failed to save user to db'));

    // create jwt token
    const payload = { username: username };
    const token = utilities.generateToken(payload);
    return Promise.resolve(token);
  }
}