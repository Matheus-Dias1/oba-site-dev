
exports.up = function(knex) {
    return knex.schema.createTable('schedule', function (table){
      table.date('date');
      table.string('city');
      table.integer('morning_deliveries').notNullable();
      table.integer('afternoon_deliveries').notNullable();
      table.integer('night_deliveries').notNullable();
      table.primary(['date', 'city']);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('schedule');
  };
  