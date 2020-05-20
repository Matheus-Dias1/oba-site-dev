
exports.up = function(knex) {
    return knex.schema.createTable('shopping_carts', function (table){
        table.integer('id_user').notNullable();
        table.integer('id_product').notNullable();
        table.float('amount').notNullable();
        table.string('observation');
        table.string('unit').notNullable();

        table.foreign('id_user').references('users.id');
        table.foreign('id_product').references('products.id');

      });
};

exports.down = function(knex) {
  return knex.schema.dropTable('shopping_carts');
};


