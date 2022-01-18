require('dotenv').config();
const { Pool, Client } = require("pg");
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

const pool = new Pool();

const client = new Client();
client.connect();
client
  .query('SELECT NOW() as now')
  .then(res => console.log(res.rows[0]))
  .catch(e => console.error(e.stack))
  .then(() => client.end());

