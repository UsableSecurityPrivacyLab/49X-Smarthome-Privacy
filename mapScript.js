// Project Overwatch : Map ip plotter
// 
// 
// 4/8/2023
// 

var myLink = document.getElementById('fetchLink');
var markerData = {};
var orgsCount = {};
var ix = 0;

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
    const APIKEY = "";
    try {
        var request = new XMLHttpRequest();

        request.open('GET', 'https://api.ipdata.co/' + ip + '?api-key=' + APIKEY);

        request.setRequestHeader('Accept', 'application/json');

        request.onreadystatechange = function () {
            if (this.readyState === 4) {

                console.log(this.responseText)

                // Convert to JSON format
                const ipData = JSON.parse(this.responseText);

                //add orginization name, ip, city, and region to markerData object
                markerData[ix] = {org: ipData.asn.name, ip: ipData.ip, city: ipData.city, region: ipData.region};
                ix++;

                // Add orginization name to orgs array
                var num = ipData.asn.name;
                orgsCount[num] = orgsCount[num] ? orgsCount[num] + 1 : 1;

                // create a marker object and add it to the markers array
                addMarker(ipData.asn.name, ipData.latitude, ipData.longitude);

                // Refresh orgs list <ul>
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

// function which makes a marker object and adds it to the markers array
function addMarker(org, lat, long) {
    world.addMarkers({ name: org, coords: [lat, long] });
}