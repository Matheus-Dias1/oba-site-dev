
exports.up = function(knex) {
    return knex.schema.createTable('purchases', function (table){
        table.string('id').primary();
        table.float('value').notNullable();
        table.string('payment_method').notNullable();
        table.float('change');
        table.string('observation');
        table.date('delivery').notNullable();

        table.string('id_user').notNullable();
        table.string('id_address').notNullable();

        table.foreign('id_user').references('users.id');
        table.foreign('id_address').references('addresses.id');

      });
};

exports.down = function(knex) {
  return knex.schema.dropTable('purchases');
};
