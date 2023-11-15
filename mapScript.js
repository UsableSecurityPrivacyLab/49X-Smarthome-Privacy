// Project Overwatch : Map ip plotter
// 
// 
// 4/8/2023 - Initiation
// 
// 5/26/2023 - Convert from calling API to fetching from Postgres db.
// 

var markerData = {};
var orgsCount = {};
var ix = 0;

var timeStamps = {};

// =======================================================================
// This is the core function for querying geodata for the map/piChart.
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

            // ------------------------------------
            // 1. Call parse function
            // 2. call addMarkers function
            // -----------------------------------
            var rows = parseString(string);
            console.log("Pre addMarkers() : " + markerData);
            console.log(markerData);

            addMarkers(rows)

            // Add queried data to orgsCount for pieChart
            // resest the orgsCount to nothing to prevent duplicates
            orgsCount = [];
            orgCounts = [];
            orgNames = [];
            pieChart.reset();
            for(var i = 0; i < rows.length; i++){
                orgsCount[rows[i][4]] = orgsCount[rows[i][4]] ? orgsCount[rows[i][4]] + 1 : 1;
            }
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

    world.reset();

    for (let j = 0; j < rows.length - 1; j++) {


            // ---------------------------------------------------------------------
            // Make a call to addMarker to actually plot the data on the world map.
            // ---------------------------------------------------------------------
            addMarker(rows[j])
            markerData[j] = { org: rows[j][4], ip: rows[j][0], region: rows[j][3], domain: rows[j][5] };
        

    }




}