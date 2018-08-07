
exports.up = function (knex, Promise) {
  return knex.schema.createTable('arts', table => {
    table.increments();
    table.string('link')
    table.text('description');
    table.string('author').notNullable();
    table.timestamps(true, true);
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('arts');
};
