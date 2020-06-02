
exports.up = function(knex) {
    return knex.schema.createTable('products', function (table){
      table.increments('id').primary().notNullable();
      table.string('product_name').notNullable();
      table.string('slug').notNullable();
      table.string('category');
      table.string('delivers_to').notNullable();
      table.string('description');
      table.string('measurement_unit').notNullable();
      table.float('price').notNullable();
      table.float('full_price').defaultTo(null);
      table.float('unit_price').defaultTo(null);
      table.float('full_unit_price').defaultTo(null);
      table.string('picture_path').notNullable();
      table.boolean('available').notNullable().defaultTo(true);
      
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('products');
  };
     