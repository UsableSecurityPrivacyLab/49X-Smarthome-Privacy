// Project Overwatch : Map ip plotter
// 
// 
// 4/8/2023 - Initiation
// 
// 5/26/2023 - Convert from calling API to fetching from Postgres db.
// 

var myLink = document.getElementById('fetchLink');
var markerData = {};
var orgsCount = {};
var ix = 0;

var timeStamps = {};

// Temp function which gets the user's input ip from the input field
// and then plots it.
myLink.onclick = function () {
    var ipv = document.getElementById('ipInput').value;
    console.log(ipv);
    if (ipv.length > 1) {
        fetchDataFromIP(ipv);
    }
    else {
        alert("Not a valid IP");
    }
}

// Core function for calling ipdata api.
function fetchDataFromIP(ip) {

    //  Need to hide our API key...
    const APIKEY = "ae34d6dcc7cb3e2a8c7cf4de0b40b3f2a4bdf64f6f4dd530fb840269";
    try {
        var request = new XMLHttpRequest();

        request.open('GET', 'https://api.ipdata.co/' + ip + '?api-key=' + APIKEY);

        request.setRequestHeader('Accept', 'application/json');

        request.onreadystatechange = function () {
            if (this.readyState === 4) {

                // console.log(this.responseText);

                // Convert to JSON format
                const ipData = JSON.parse(this.responseText);

                // Add timestamp to timeStamp object
                let time = ipData.time_zone.current_time;
                timeStamps[time] = timeStamps[time] ? timeStamps[time] + 1 : 1;

                //add orginization name, ip, city, and region to markerData object
                //if the ip is already in the object, do not add it again
                let exists = false;
                for (var key in markerData) {
                    if (markerData[key].ip === ipData.ip) {
                        exists = true;
                    }
                }
                if (!exists) {
                    markerData[ix] = { org: ipData.asn.name, ip: ipData.ip, region: ipData.region };
                    ix++;
                }

                // Add orginization name to orgs array
                var num = ipData.asn.name;
                orgsCount[num] = orgsCount[num] ? orgsCount[num] + 1 : 1;

                // create a marker object and add it to the markers array
                addMarker(ipData.asn.name, ipData.latitude, ipData.longitude);

                // Refresh orgs list <ul>
                // displayOrgs();
            }
        };

        request.send();
    }
    catch {
        alert("Error fetching data from ipdata...");
        console.log("Error fetching data from ipdata...");
    }
}

// *********************************************************
// This function wont be needed soon.
// Shri told us to only display top orgs via the pie chart.
// *********************************************************

//function which displays each item in the orgsCount object in the html
// function displayOrgs() {
//     const ul = document.getElementById('orgs-list');
//     ul.innerHTML = "";
//     for (var key in orgsCount) {
//         let li = document.createElement("li");
//         let node = document.createTextNode(key + " : " + orgsCount[key]);
//         li.appendChild(node);
//         ul.appendChild(li);
//     }
// }






// =================================================================
// All functions past this point do not involve the ipdata api.
// They are called in sequence after fetching data from the DB.
// Aretha should be calling the api and storing the data already.
// =================================================================


// =======================================================================
// This is the core function for making a query to the postgres db.
// IMPORTANT RULE: Format for sending a query request 
// to the NODE server. Use '_' instead of ' ' for spaces.
//  EXAMPLE: query = "SELECT_*_FROM_geodata"
// 
// This function requires that the NODE.js server is running.
// To start the server, type: "node app.js" in terminal.
// =======================================================================
function pullData(query) {

    // Check for undefined or null
    if (query === undefined) {
        const err = "***** Empty Query.";
        console.error(err);
        return err;
    }

    // Check for proper format. No ' '.
    if (query.includes(' ')) {
        const err = "***** Query improper format. Replace all ' ' with '_' ";
        console.error(err);
        return err;
    }


    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "http://localhost:3000/getQuery?" + query, true);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            // Result stored in string
            string = xmlhttp.responseText;

            console.log("FETCHED FROM DB: " + string);

            // ------------------------------------
            // 1. Call parse function
            // 2. call addMarkers function
            // -----------------------------------
            var rows = parseString(string);
            addMarkers(rows)
        }
    }
    xmlhttp.send();
}


// ===============================================
// Parse function for separating queried results
// ===============================================
function parseString(string) {

    var rows = string.split("~~")

    for (let i = 0; i < rows.length; i++) {

        rows[i] = rows[i].split("__")

    }

    // console.log(rows);

    return rows;

}

// ======================================================================
// function which makes a marker object and adds it to the markers array
// ======================================================================
function addMarker(row) {
    world.addMarkers({ name: row[4], coords: [row[1], row[2]] });
}

// ======================================================================
// Add orginization name, ip, city, and region to markerData object.
// If the ip is already in the object, do not add it again.
// The markerData object stores data to be displayed afer a world marker
// is clicked by the user.
// ======================================================================
function addMarkers(rows) {

    for (let j = 0; j < rows.length - 1; j++) {

        let exists = false;
        for (var key in markerData) {
            if (markerData[key].ip === rows[j][0]) {
                exists = true;
            }
        }
        if (!exists) {
            // ---------------------------------------------------------------------
            // Make a call to addMarker to actually plot the data on the world map.
            // ---------------------------------------------------------------------
            addMarker(rows[j])
            markerData[ix] = { org: rows[j][4], ip: rows[j][0], region: rows[j][3] };
            ix++;
        }

    }

}