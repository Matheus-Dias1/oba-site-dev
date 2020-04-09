
exports.up = function(knex) {
    return knex.schema.createTable('products', function (table){
      table.string('id').primary();
      table.boolean('available').notNullable().defaultTo(true);
      table.string('product_name').notNullable();
      table.string('description');
      table.string('measurement_unit').notNullable();
      table.float('price').notNullable();
      table.float('unit_price');
      table.string('picture_path').notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('products');
  };
  