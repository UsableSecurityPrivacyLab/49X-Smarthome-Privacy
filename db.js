const { Client } = require('pg')
 
 
const client = new Client({
  user: 'aretha',
  host: 'localhost',
  database: 'test',
  password: 'password',
  port: 5432,
})

client.connect((err) => {
    if (err) {
      console.error('connection error', err.stack)
    } else {
      console.log('connected')
    }
  })
 
client.query('SELECT * FROM devices', (err, res) => {

  console.log(res.rows);

  var data = res.rows;

  // console.log(err, res)
  client.end()
})