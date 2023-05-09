const { Pool, Client } = require('pg')
 
const pool = new Pool({
  user: 'aretha',
  host: 'localhost',
  database: 'test',
  password: 'password',
  port: 922,
})
 
pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  pool.end()
})
 
const client = new Client({
  user: 'aretha',
  host: 'localhost',
  database: 'test',
  password: 'password',
  port: 922,
})
client.connect()
 
client.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  client.end()
})