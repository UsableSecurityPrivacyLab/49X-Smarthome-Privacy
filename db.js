const { Client } = require('pg')
 
 
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'test',
  password: '',
  port: 922,
})

client.connect((err) => {
    if (err) {
      console.error('connection error', err.stack)
    } else {
      console.log('connected')
    }
  })
 
// client.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   client.end()
// })