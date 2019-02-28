const knexConfig = {
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'tylerburkhardt',
      database : 'superblock'
    },
};

module.exports = require('knex')(knexConfig);