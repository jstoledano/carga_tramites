const { Pool, Client } = require("pg");
require('dotenv').config();

const pool = new Pool();

// pool.query('SELECT NOW()', (err, res) => {
//     console.log(err, res);
//     pool.end();
// });

const client = new Client();
client.connect();
client
  .query('SELECT NOW() as now')
  .then(res => console.log(res.rows[0]))
  .catch(e => console.error(e.stack))
  .then(() => client.end());