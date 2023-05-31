const { Client } = require('pg').native
 
 
const client = new Client({
  user: 'aretha',
  host: 'localhost',
  database: 'test',
  password: 'password',
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
