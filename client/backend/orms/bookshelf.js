var config = require("../services/ConfigService")
var knex = require('knex')(config.db);
let bookshelf = require('bookshelf')

module.exports = bookshelf(knex)
                    .plugin('bookshelf-camelcase')
                    .plugin('pagination');
