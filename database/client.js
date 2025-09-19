const { Client } = require('pg');

const pgclient = new Client({
  host: 'db',
  port: '5432',
  user: 'user',
  password: 'pass',
  database: 'actifai'
});

console.log('Connecting to database...');

pgclient.connect();

console.log('Connected to database.');

module.exports = {
  pgclient
}