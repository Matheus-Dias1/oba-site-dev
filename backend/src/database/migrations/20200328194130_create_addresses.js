
exports.up = function(knex) {
    return knex.schema.createTable('addresses', function (table){
        table.string('id').primary();
        table.string('zip_code').notNullable();
        table.string('country').notNullable();
        table.string('state').notNullable();
        table.string('city').notNullable();
        table.string('neighborhood').notNullable();
        table.string('street').notNullable();
        table.string('number').notNullable();
        table.string('complement');
        
        table.string('id_user').notNullable();

        table.foreign('id_user').references('users.id');

      });
};

exports.down = function(knex) {
  return knex.schema.dropTable('addresses');
};
