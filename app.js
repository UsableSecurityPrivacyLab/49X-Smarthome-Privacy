const http = require('http');
const fs = require('fs');
const url = require('url');
const { Client } = require('pg')

var data
 
const client = new Client({
    user: 'aretha',
    host: 'localhost',
    database: 'test',
    password: 'password',
    port: 5432,
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
    if(path=="/getQuery"){
        console.log("request recieved");
      // QUERY 
      // 
      client.connect((err) => {
        if (err) {
          console.error('connection error', err.stack)
        } else {
          console.log('Connection to db successful!')
          console.log("==================================")
        }
      })

      // This needs to be waited on
      // 
      client.query('SELECT * FROM geodata', (err, res) => {

        data = res.rows[0].ip;

        console.log("Geodata table: ")
        console.log(data)
      })


        response.setHeader("Access-Control-Allow-Origin", 'http://127.0.0.1:5500');
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.end(data);
        console.log("string sent");


        client.end();
      console.log("==================================")
      console.log("Ending db connection...")
    }
    else if(path =="/closeDB"){
      // 
      // CLOSE THE DB CONNECTION
      client.end();
      console.log("==================================")
      console.log("Ending db connection...")
    }
    else if(path == "/openDB"){

      client.connect((err) => {
        if (err) {
          console.error('connection error', err.stack)
        } else {
          console.log('Connection to db successful!')
          console.log("==================================")
        }
      })

    }
    else{
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