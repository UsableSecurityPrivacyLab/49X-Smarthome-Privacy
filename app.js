const http = require('http');
const fs = require('fs');
const url = require('url');
const { Client } = require('pg')

var data = null

 
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
      // SELECTING ALL FROM GEODATA TABLE
      // CURRENTLY ONLY SENDING BACK FIRST IP FROM rows[0]
      //  
      client.query('SELECT * FROM geodata', (err, res) => {

        data = res.rows[0].ip;


        console.log("Geodata table: ")
        console.log(data)


        console.log("==================================")
        console.log("Ending connection...")
        client.end()
      })
      
    }
  })


//   
// 
// NODE JS SERVER CODE STARTS HERE
// 
// THIS NEEDS TO BE RUNNING IN ORDER TO FETCH THE IPS FROM THE DASHBOARD.
// RUN WITH "node app.js" IN TERMINAL
// 

const hostname = '127.0.0.1';
const port = 3000;


const server = http.createServer(function(request, response){
    var path = url.parse(request.url).pathname;
    if(path=="/getstring"){
        console.log("request recieved");
        console.log("string '" + data + "' chosen");
        response.setHeader("Access-Control-Allow-Origin", 'http://127.0.0.1:5500');
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.end(data);
        console.log("string sent");
    }else{
        fs.readFile('./index.html', function(err, file) {  
            if(err) {  
                // write an error response or nothing here  
                return;  
            }  
            response.writeHead(200, { 'Content-Type': 'text/html' });  
            response.end(file, "utf-8");  
        });
    }
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});