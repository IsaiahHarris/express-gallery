
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('arts', table=>{
    table.string('link').notNullable().alter()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('arts', table=>{
    table.string('link').nullable().alter()
  })
};