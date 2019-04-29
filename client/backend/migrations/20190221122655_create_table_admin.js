exports.up = function(knex, Promise) {
    return knex.schema.createTable('admins', function(table) {
        table.integer('id').primary();
        table.string('nickname');
        table.string('address');
        table.integer('version').unsigned().defaultTo(1);
        table.text('data');
        table.timestamps();
        table.index('address');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('admins')
};
