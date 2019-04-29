require('dotenv').config({path: __dirname+'/../../.env'});
module.exports = {

  development: {
    client: 'mysql',
    connection: {
        "host"     : process.env.DB_HOST,
        "user"     : process.env.DB_USER,
        "password" : process.env.DB_PASS,
        "database" : process.env.DB_NAME,
        "charset"  : "utf8"
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  rinkeby: {
    client: 'mysql',
    connection: {
        "host"     : process.env.DB_HOST_RINKEBY,
        "user"     : process.env.DB_USER_RINKEBY,
        "password" : process.env.DB_PASS_RINKEBY,
        "database" : process.env.DB_NAME_RINKEBY,
        "charset"  : "utf8"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  live: {
    client: 'mysql',
    connection: {
        "host"     : process.env.DB_HOST_MAINNET,
        "user"     : process.env.DB_USER_MAINNET,
        "password" : process.env.DB_PASS_MAINNET,
        "database" : process.env.DB_NAME_MAINNET,
        "charset"  : "utf8"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
