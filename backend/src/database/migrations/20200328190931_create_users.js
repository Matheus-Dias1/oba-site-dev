
exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.increments('id').primary().notNullable();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.string('phone').notNullable();
    table.boolean('admin').notNullable().defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
