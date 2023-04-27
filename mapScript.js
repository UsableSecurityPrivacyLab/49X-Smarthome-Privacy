// Project Overwatch : Map ip plotter
// 
// 
// 4/8/2023
// 
var canvas = document.getElementById('map');
var context = canvas.getContext('2d');
var map = document.getElementById('mapImg');
var pin = document.getElementById('pinImg');
var myLink = document.getElementById('fetchLink');
// Bad idea to declare global index, remove later.
let ix = 0;
var orgsCount = {};


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

// This function gets called when the window loads.
// It draws the map image on the canvas.
window.onload = function () {
    context.drawImage(map, 0, 0, 1024, 550);
}

// Function for converting a latitude and longitude to x, y coordinates
// based on the size of the canvas.
function getXYFromCoordinates(latitude, longitude) {
    const imageWidth = 1024;
    const imageHeight = 550;

    const x = ((longitude + 180) / 360) * imageWidth;
    const y = ((latitude * -1) + 90) / 180 * imageHeight;

    return { x, y };
}

// This function draws a circle on the map canvas at point x, y.
function plotPoints(x, y) {
    context.moveTo(x + 15, y);
    context.strokeStyle = "black";
    context.arc(x, y, 15, 0, 2 * Math.PI);
    context.stroke();
    context.strokeStyle = 'rgba(' + [0, 0, 0, 0] + ')';

}

// This function draws a pin image on the map canvas at point x, y.
function plotPointsPin(x, y) {
    context.drawImage(pin, x - 10, y - 30, 20, 30);
}

// Core function for calling ipdata api.
// This fuction also calls plotPoints().
function fetchDataFromIP(ip) {

    //  Need to hide our API key...
    const APIKEY = "";
    try {
        var request = new XMLHttpRequest();

        request.open('GET', 'https://api.ipdata.co/' + ip + '?api-key=' + APIKEY);

        request.setRequestHeader('Accept', 'application/json');

        request.onreadystatechange = function () {
            if (this.readyState === 4) {

                // console.log(this.responseText);

                // Convert to JSON format
                const ipData = JSON.parse(this.responseText);

                // Call getXY with lat/long values
                var location = getXYFromCoordinates(ipData.latitude, ipData.longitude);

                // Call plot points with coords
                plotPoints(location.x, location.y);

                // Add orginization name to orgs array
                var num = ipData.asn.name;
                orgsCount[num] = orgsCount[num] ? orgsCount[num] + 1 : 1;

                // Refresh orgs list
                // This could be changed to run every x seconds rather than after each point plotted..
                displayOrgs();
            }
        };

        request.send();
    }
    catch {
        alert("Error fetching data from ipdata...");
        console.log("Error fetching data from ipdata...");
    }
}

//function which displays each item in the orgsCount object in the html
function displayOrgs() {
    const ul = document.getElementById('orgs-list');
    ul.innerHTML = "";
    for (var key in orgsCount) {
        let li = document.createElement("li");
        let node = document.createTextNode(key + " : " + orgsCount[key]);
        li.appendChild(node);
        ul.appendChild(li);
    }
}


