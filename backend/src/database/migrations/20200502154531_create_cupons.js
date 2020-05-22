
exports.up = function (knex) {
    return knex.schema.createTable('cupons', function (table) {
        table.string('code').primary().notNullable();
        table.integer('amount').notNullable();
        table.integer('expiration_date').notNullable();
        table.string('discount_type').notNullable();
        table.float('discount').notNullable();
        table.float('min_value');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('cupons');
};


