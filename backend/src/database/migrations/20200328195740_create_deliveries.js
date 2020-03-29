
exports.up = function(knex) {
    return knex.schema.createTable('deliveries', function (table){
        table.string('id').primary();
        table.date('date').notNullable();
        table.string('id_purchase').notNullable();

        table.foreign('id_purchase').references('purchases.id');
      });
};

exports.down = function(knex) {
  return knex.schema.dropTable('deliveries');
};
