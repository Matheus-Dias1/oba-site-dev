
exports.up = function(knex) {
    return knex.schema.createTable('schedule', function (table){
      table.increments('id').primary().notNullable();
      table.string('id_purchase');
      table.date('date').notNullable();
      table.time('time').notNullable();

      table.foreign('id_purchase').references('purchases.id');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('schedule');
  };
  