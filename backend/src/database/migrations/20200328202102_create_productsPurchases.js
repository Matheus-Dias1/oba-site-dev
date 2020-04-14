
exports.up = function(knex) {
    return knex.schema.createTable('productsPurchases', function (table){
        table.float('amount').notNullable();
        table.string('observation');
        table.boolean('unit').notNullable(); // UN -> true  KG -> false

        table.string('id_purchase').notNullable();
        table.string('id_product').notNullable();

        table.foreign('id_purchase').references('purchases.id');
        table.foreign('id_product').references('products.id');

      });
};

exports.down = function(knex) {
  return knex.schema.dropTable('productsPurchases');
};
