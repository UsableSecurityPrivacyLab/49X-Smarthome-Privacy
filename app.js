const http = require('http');
const fs = require('fs');
const url = require('url');
const { Client } = require('pg');



let connected = false;

const hostname = '127.0.0.1';
const port = 3000;

async function handleRequest(request, response) {
  const path = url.parse(request.url).pathname;
  if (path === '/getQuery') {


    // Parse our query from request.url
    //  
    let detach = request.url.split('?'); // This separates the url into 2 parts: [/getQuery] and [SELECT_*_FROM_geodata]
    let query1 = detach[1].split('_').join(' '); // This replaces '_' with ' '
    query1 = query1.split('%27').join('\'');

    console.log(query1) // Final result: 'SELECT * FROM geodata'


    // Create a new Client for connection
    const client = new Client({
      user: 'aretha',
      host: 'localhost',
      database: 'test',
      password: 'password',
      port: 5432,
    });


    console.log('request received');
    try {
      if (!connected) { // Connect to db if not already connected
        await client.connect();
        connected = true;
        console.log('====== Connection to db successful! ======');
      }
      const res = await client.query(query1); // Call actual query
      try {await client.end() // Disconnect from db
        connected = false;
        console.log("====== client disconnected ======")
      } catch {
        console.log("failed to disconnect client")
        connected = true;
      }
  
      // ================================================================
      // The data we return will need to change based on the query...
      // This currently only works if we query row(s) from geodata table.
      var data = "";
      console.log('Geodata table:');

      for (let i = 0; i < res.rows.length; i++) {
        data += res.rows[i].ip + "__";
        data += res.rows[i].lat + "__";
        data += res.rows[i].lon + "__";
        data += res.rows[i].c_code + "__";
        data += res.rows[i].c_name + "__";
        data += res.rows[i].domain + "~~";
      }
    

      console.log(data);

      response.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
      response.writeHead(200, { 'Content-Type': 'text/plain' });
      response.end(data); // Return value
      console.log('string sent');
      
    } catch (err) {
      console.error('Query error:', err);
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.end('Internal Server Error');
    }
  } else {
    fs.readFile('./index.html', function (err, file) {
      if (err) {
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.end('Internal Server Error');
        return;
      }
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(file, 'utf-8');
    });
  }
}

const server = http.createServer(handleRequest);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});