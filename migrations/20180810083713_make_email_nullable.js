
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('users', table=>{
    table.string('email').notNullable().alter()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('users', table=>{
    table.string('email').nullable().alter()
  })
};
