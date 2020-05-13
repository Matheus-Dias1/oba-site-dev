
exports.up = function(knex) {
    return knex.schema.createTable('schedule', function (table){
      table.date('date').primary();
      table.integer('morning_deliveries').notNullable();
      table.integer('afternoon_deliveries').notNullable();
      table.string('city').notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('schedule');
  };
  