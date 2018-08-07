
exports.up = function (knex, Promise) {
  return knex.schema.createTable('arts', table => {
    table.increments();
    table.string('link')
    table.text('description');
    table.integer('author_id').references('users.id');
    table.timestamps(true, true);
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('arts');
};
