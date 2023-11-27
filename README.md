# 49X-Smarthome-Privacy

To start the dashboard, you need to have index.html hosted on a local server.
There a many ways to do this, including using a vs code extension.

The node.js server needs to be running so that queries can be sent to the postgres database.
To start the server, navigate a terminal window to the Smarthome folder, and type 'node app.js' into the command line.

Depending on what web browser you are using, you may need to allow CORS to send XMLHttpRequests. They are labeled as unsafe, but
this needs to be disabeled to properly query from the databse.


Links to packages used:

JS Vector map: https://jvm-docs.vercel.app/docs/introduction

Chart.js: https://www.chartjs.org/docs/latest/getting-started/installation.html

Postgres: https://node-postgres.com 