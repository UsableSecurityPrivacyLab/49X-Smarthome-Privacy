var canvas = document.getElementById('map');
var context = canvas.getContext('2d');
var map = document.getElementById('mapImg');
var pin = document.getElementById('pinImg');



var myLink = document.getElementById('fetchLink');

myLink.onclick = function(){
    var ipv = document.getElementById('ipInput').value;
    console.log(ipv);
    if(ipv.length > 1){
        fetchDataFromIP(ipv);
    }
    else{
        alert("Not a valid IP");
    }
    
}

window.onload = function() {
    // Draw map image on canvas
    context.drawImage(map, 0, 0, 1024, 550);

    }

function getXYFromCoordinates(latitude, longitude) {
        const imageWidth = 1024;
        const imageHeight = 550;
        
        const x = ((longitude + 180) / 360) * imageWidth;
        const y = ((latitude * -1) + 90) / 180 * imageHeight;
        
        return { x, y };
    }


function plotPoints(x, y){

    context.moveTo(x + 15, y);
    context.strokeStyle = "black";
    context.arc(x, y, 15, 0, 2 * Math.PI);
    context.stroke();
    context.strokeStyle = 'rgba(' + [0, 0, 0, 0] + ')';

}

function plotPointsPin(x, y){
    context.drawImage(pin, x -10, y -30, 20, 30);
}




function fetchDataFromIP(ip){

    //  Need to hide our API key...
    let APIKEY = "";
    try{
        var request = new XMLHttpRequest();

        request.open('GET', 'https://api.ipdata.co/' + ip + '?api-key=' + APIKEY);

        request.setRequestHeader('Accept', 'application/json');

        request.onreadystatechange = function () {
        if (this.readyState === 4) {

            console.log(this.responseText);

            // Convert to JSON format
            const ipData = JSON.parse(this.responseText);

            // Call getXY with lat/long values
            var location = getXYFromCoordinates(ipData.latitude, ipData.longitude);

            // Call plot points with coords
            plotPoints(location.x, location.y);
            }
        };

        request.send();
    }
    catch{
        // alert("Error fetching data from ipdata...");
        console.log("Error fetching data from ipdata...");
    }
}