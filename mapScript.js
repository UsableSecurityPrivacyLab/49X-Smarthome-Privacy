// Project Overwatch : Map ip plotter
// 
// 
// 4/8/2023
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
                markerData[ix] = {org: ipData.asn.name, ip: ipData.ip, city: ipData.city, region: ipData.region};
                ix++;
                }

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