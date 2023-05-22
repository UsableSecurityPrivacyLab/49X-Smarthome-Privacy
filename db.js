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
      console.log("==================================")

      // 
      // INSERT DATA INTO GEODATA TABLE
      // 
      //client.query('INSERT INTO geodata (ip, lat, lon, c_code, c_name, domain) VALUES (\'8.8.8.8\', \'34.05440139770508\', \'-118.24410247802734\', \'US\', \'Google LLC\', \'google.com\')');
      

      // 
      // SELECTING ALL FROM GEODATA TABLE
      //  
      client.query('SELECT * FROM geodata', (err, res) => {

        var data = res.rows;


        console.log("Geodata table: ")
        console.log(data[0].ip)


        console.log("==================================")
        console.log("Ending connection...")
        client.end()
      })
      
    }
  })
