const db = require('../../data/dbConfig.js');

function findBy(filter) {
    return db('users')
      .select('id', 'username', 'password')
      .where(filter);
}

function findById(id) {
    return db('users')
      .select('id', 'username', 'password')
      .where('id', id)
      .first();
}  

async function addUser(user) {
    const [id] = await db('users').insert(user);

    return findById(id);
}

module.exports = { findBy, addUser };