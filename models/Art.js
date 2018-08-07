const bookshelf = require('./bookshelf');

class Art extends bookshelf.Model{
  get tableName() { return 'arts' };
  get hasTimestamps() { return true };

  author(){
    return this.belongsTo('User', 'author_id');
  }
}

module.exports = bookshelf.model('Art', Art)