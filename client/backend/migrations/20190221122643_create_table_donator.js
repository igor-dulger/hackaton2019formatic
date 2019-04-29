exports.up = function(knex, Promise) {
  return knex.schema.createTable('donators', function(table) {
    table.integer('id').primary();
    table.string('first_name');
    table.string('last_name');
    table.string('country');
    table.integer('birthday');
    table.integer('donated_date');
    table.string('identifier');
    table.string('image');
    table.string('facebook');
    table.string('linkedin');
    table.string('twitter');
    table.integer('version').unsigned().defaultTo(1);
    table.text('data');
    table.text('description');
    table.timestamps();
    table.index('first_name');
    table.index('last_name');
    table.index('country');
    table.index('birthday');
    table.index('identifier');
    table.index('donated_date');
    table.index(['first_name', 'last_name'], 'full_text_donator_index', 'FULLTEXT');
}).createTable('hashes', function(table) {
    table.integer('id').primary();
    table.integer('donator_id').unsigned();
    table.string('created_tx_hash');
    table.integer('created_block_id').unsigned();
    table.integer('created_date');
    table.string('updated_tx_hash');
    table.integer('updated_block_id').unsigned();
    table.integer('updated_date');
    table.timestamps();
    table.unique('donator_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('donators')
    .dropTable('hashes');
};
