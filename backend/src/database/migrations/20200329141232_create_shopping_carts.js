
exports.up = function(knex) {
    return knex.schema.createTable('shopping_carts', function (table){
        table.string('id_user').notNullable();
        table.string('id_product').notNullable();
        table.float('amount').notNullable();
        table.boolean('unit').notNullable(); // UN -> true  KG -> false

        table.foreign('id_user').references('users.id');
        table.foreign('id_product').references('products.id');

      });
};

exports.down = function(knex) {
  return knex.schema.dropTable('shopping_carts');
};
