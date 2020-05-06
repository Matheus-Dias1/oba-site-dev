
exports.up = function(knex) {
    return knex.schema.createTable('products', function (table){
      table.increments('id').primary().notNullable();
      table.string('product_name').notNullable();
      table.string('category');
      table.string('description');
      table.float('price').notNullable();
      table.string('measurement_unit').notNullable();
      table.float('unit_price');
      table.string('picture_path').notNullable();
      table.boolean('available').notNullable().defaultTo(true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('products');
  };
  