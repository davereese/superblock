const knex = require('../services/knex').knex;
const utilities = require('../utilities');

module.exports = class Users {
  
  static async list() {
    try {
      return await knex('users');
    } catch (error) {
      throw error;
    }
  }

  static async search(searchValue) {
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

  static async create(request) {
    const username = request.username;
    const password = request.password;
    const email = request.email;

    try {
      // check that username doesn't already exist
      await utilities.duplicateUserCheck(username)
    
      // hash user password
      const hashedPassword = await utilities.hashPassword(password)

      // create jwt token
      const payload = { user: username };
      const token = utilities.generateToken(payload);
      
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

  static async delete(userId) {
    try {
      await this.search(userId);
      await knex('users').where('id', userId).del();
      return;
    } catch (error) {
      throw error;
    }
  }
}