const {Pool} = require('pg');
const config = require('./config.js');
const pool = new Pool(config.db);

async function query(query/*, params*/)
{
  const {rows, fields} = await pool.query(query/*, params*/);
  return rows;
}

function emptyOrRows(rows)
{
  if(!rows)
  {
    return [];
  }
  return rows;
}

function closeConnection()
{
  pool.end();
}
module.exports = {
  query, emptyOrRows, closeConnection
}
