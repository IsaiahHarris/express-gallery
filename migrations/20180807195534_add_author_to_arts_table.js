
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('arts',table=>{
    table.string('author')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('arts',table=>{
    table.dropColumn('author')
  })
};
