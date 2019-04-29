exports.up = function(knex, Promise) {
    return knex.schema.createTable('groups', function(table) {
        table.integer('id').primary();
        table.string('code');
        table.string('name');
        table.string('description');
        table.integer('version').unsigned().defaultTo(1);
        table.text('data');
        table.timestamps();
        table.unique('code');
        table.index('code');
    }).createTable('donators_groups', function(table) {
        table.integer('donator_id').unsigned();
        table.integer('group_id').unsigned();
        table.integer('position').unsigned().defaultTo(1);
        table.index('donator_id');
        table.index('group_id');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('groups').dropTable('donators_groups');
};
