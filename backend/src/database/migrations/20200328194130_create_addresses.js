
exports.up = function (knex) {
  return knex.schema.createTable('addresses', function (table) {
    table.increments('id').primary().notNullable();
    table.string('id_user').notNullable();
    table.string('country').notNullable();
    table.string('state').notNullable();
    table.string('city').notNullable();
    table.string('neighborhood').notNullable();
    table.string('street').notNullable();
    table.string('number').notNullable();
    table.string('complement');
    table.boolean('visible')
      .notNullable()
      .defaultTo(true);
    table.string('lat').notNullable();
    table.string('long').notNullable();


    table.foreign('id_user').references('users.id');

  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('addresses');
};
