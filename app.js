// This file is the core Node.js server logic.
// When a seperate script passes a query, it uses XMLHttpRequest,
// Which means the query has to be in a form which a URL can handle. For this reason,
// we have to convert certain characters back to normal in this file. For instance,
//  '%27' needs to be converted back to '\'' because a URL cannot accept backslashes.

const http = require('http');
const fs = require('fs');
const url = require('url');
const { Client } = require('pg');



let connected = false;

const hostname = '127.0.0.1';
const port = 3000;

async function handleRequest(request, response) {
  const path = url.parse(request.url).pathname;

  //split the http argument from the URL and reformat as a proper query.
  let detach = request.url.split('?');
  let query1 = detach[1].split('__').join(' ');
  query1 = query1.split('%27').join('\'');
  query1 = query1.split('%3E').join('>');
  query1 = query1.split('%2E').join('.');


  // Create a new Client for connection
  const client = new Client({
    user: 'david',
    host: 'localhost',
    database: 'homewatch',
    password: '491-Home!privacy',
    port: 5433,
  });

  //
  // There are serveral else if statements which determine which query to parse.
  // This path is for parsing the Geodata query for the map.
  // 
  if (path === '/getQuery') {

    console.log('request received');
    try {
      if (!connected) { // Connect to db if not already connected
        await client.connect();
        connected = true;
        console.log('====== Connection to db successful! ======');
      }
      const res = await client.query(query1); // Call actual query
      try {
        await client.end() // Disconnect from db
        connected = false;
        console.log("====== client disconnected ======")
      } catch {
        console.log("failed to disconnect client")
        connected = true;
      }

      var data = "";

      // This constructs a string to be passed back over the XMLHttpRequest.
      // The string is the reslut from the current query.
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
      response.end(data);
      console.log('string sent');

    } catch (err) {
      console.error('Query error:', err);
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.end('Internal Server Error');
    }

  
  // 
  // This else if is for the query which loads devices.
  // 
  } else if (path === '/loadDevices') {

    console.log('request received');
    try {
      if (!connected) {
        await client.connect();
        connected = true;
        console.log('====== Connection to db successful! ======');
      }
      const res = await client.query(query1);
      try {
        await client.end()
        connected = false;
        console.log("====== client disconnected ======")
      } catch {
        console.log("failed to disconnect client")
        connected = true;
      }

      var data = "";

      for (let i = 0; i < res.rows.length; i++) {
        data += res.rows[i].mac + "__";
        data += res.rows[i].name + "__";
        data += res.rows[i].trusted + "~~";
      }

      console.log(data);
      console.log('Loading Devices')

      response.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
      response.writeHead(200, { 'Content-Type': 'text/plain' });
      response.end(data);
      console.log('string sent');

    } catch (err) {
      console.error('Query error:', err);
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.end('Internal Server Error');
    }

  }


  // 
  // This path is simply for calling an UPDATE query.
  // We use this to update device names in the DB.
  // 
  else if (path === '/update') {

    console.log('request received');
    try {
      if (!connected) {
        await client.connect();
        connected = true;
        console.log('====== Connection to db successful! ======');
      }
      const res = await client.query(query1);
      try {
        await client.end()
        connected = false;
        console.log("====== client disconnected ======")
      } catch {
        console.log("failed to disconnect client")
        connected = true;
      }

      response.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
      response.writeHead(200, { 'Content-Type': 'text/plain' });
      response.end(data);
      console.log('string sent');

    } catch (err) {
      console.error('Query error:', err);
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.end('Internal Server Error');
    }

  }


  // 
  // This path is for loading data onto the frequency graph.
  // 
  else if (path === '/frequency') {

    console.log('request received');
    try {
      if (!connected) {
        await client.connect();
        connected = true;
        console.log('====== Connection to db successful! ======');
      }
      const res = await client.query(query1);
      try {
        await client.end()
        connected = false;
        console.log("====== client disconnected ======")
      } catch {
        console.log("failed to disconnect client")
        connected = true;
      }

      var data = "";

      for (let i = 0; i < res.rows.length; i++) {
        data += res.rows[i].minute + "__";
        data += res.rows[i].count + "~~";
      }

      response.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
      response.writeHead(200, { 'Content-Type': 'text/plain' });
      response.end(data);
      console.log('string sent');

    } catch (err) {
      console.error('Query error:', err);
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.end('Internal Server Error');
    }
  }


  // 
  // This path is for loading the most traffic widget.
  // 
  else if (path === '/loadTraffic') {

    console.log('request received');
    try {
      if (!connected) { // Connect to db if not already connected
        await client.connect();
        connected = true;
        console.log('====== Connection to db successful! ======');
      }
      const res = await client.query(query1); // Call actual query
      try {
        await client.end() // Disconnect from db
        connected = false;
        console.log("====== client disconnected ======")
      } catch {
        console.log("failed to disconnect client")
        connected = true;
      }

      var data = "";

      for (let i = 0; i < res.rows.length; i++) {
        data += res.rows[i].mac + "__";
        data += res.rows[i].tlen + "__";
        data += res.rows[i].name + "~~";
      }

      response.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
      response.writeHead(200, { 'Content-Type': 'text/plain' });
      response.end(data); // Return value
      console.log('string sent');

    } catch (err) {
      console.error('Query error:', err);
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.end('Internal Server Error');
    }

  }


  // 
  // The final else statement
  // catches if no path is specified or does not exist.
  // 
  else {
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