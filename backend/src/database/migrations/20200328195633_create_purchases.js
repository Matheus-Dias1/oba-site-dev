
exports.up = function (knex) {
  return knex.schema.createTable('purchases', function (table) {
    table.increments('id').primary().notNullable();
    table.string('cupon').notNullable();
    table.string('id_user').notNullable();
    table.string('id_address').notNullable();
    table.float('value').notNullable();
    table.string('payment_method').notNullable();
    table.float('change');
    table.string('observation');
    table.datetime('purchase-time')
      .notNullable()
      .defaultTo(knex.fn.now());
    table.boolean('delivered').notNullable().defaultTo(false);
    table.date('delivery_date').notNullable();
    table.string('delivery_period').notNullable();



    table.foreign('id_user').references('users.id');
    table.foreign('id_address').references('addresses.id');

  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('purchases');
};
