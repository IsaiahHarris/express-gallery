const bookshelf = require('./bookshelf');

class User extends bookshelf.Model{
  get tableName() { return 'users' };
  get hasTimestamps() { return true };

  arts(){
    return this.hasMany('Arts', 'author_id')
  }
}

module.exports = bookshelf.model('User', User)