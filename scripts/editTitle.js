// This file is for getting the device list and displaying and changing the name of the selected device.
// It also invokes itself at the bottom of the file.


var dynamicList = document.getElementById("dynamicList");
var devices;


// Query devices table mac addresses & names
function loadDevices() {

    var query = "SELECT__mac,__name__FROM__devices;"

    // Check for undefined or null
    if (query === undefined) {
        const err = "***** Empty Query.";
        console.error(err);
        return err;
    }

    // Check for proper format. No ' '.
    if (query.includes(' ')) {
        const err = "***** Query improper format. Replace all ' ' with '__' ";
        console.error(err);
        return err;
    }

    // This XMLHttpRequest creates a GET request with a constructed url. 
    // The URL has the port used to communicate over the Node.JS server, a path that is used in parsing and a query that will be passed along to the database.
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "http://localhost:3000/loadDevices?" + query, true);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            // Result stored in string
            string = xmlhttp.responseText;


            devices = parseString(string);
            // console.log(devices);


            //deconstruct the returned string of data into variables we can use on the webpage.
            dynamicList.innerHTML = '';
            for(var i = 0; i < devices.length-1; i++){

                var mac = devices[i][0];
                var name = devices[i][1];
                // After we have mac addresses in the geodata table, change query to 'WHERE mac = mac' instead of 'WHERE ip = 103.76.40.123';
                var query = 'WITH__UniquePairs__AS__(SELECT__DISTINCT__ON__(lat,__lon)__*__FROM__geodata__WHERE__mac__=__\\\'' + mac + '\\\'__ORDER__BY__lat,__lon,__ip__)__SELECT__*__FROM__UniquePairs';
                var div = '<div class="' + mac + '"><h1 class="deviceName" onclick="updateDevice(\'' + name + '\', \'' + mac + '\', \'' + query + '\')" >' + name + '</h1></div>';
        
                dynamicList.innerHTML += div;
        
            }


        }
    }
    xmlhttp.send();

}


// Update name of current device
// 
var title = document.getElementById('current-device');
var saveButton = document.getElementById('save-title');
function updateName(){

    editButton.style.visibility = 'hidden'
    editButton.replaceWith(saveButton);
    saveButton.style.visibility = 'visible'
    title.contentEditable = 'true';
    title.style.backgroundColor = 'white'
    title.style.color = 'black'
    title.style.border = 'solid 2px blue'
    
}

function saveName(){
    saveButton.style.visibility = 'hidden';
    saveButton.replaceWith(editButton);
    editButton.style.visibility = 'visible';
    title.contentEditable = 'false';
    title.style.background = '#253D5B'
    title.style.border = 'none';
    title.style.color = 'white';

    newTitle = title.innerText.split(' ').join('__');
    

    var updateQuery = 'UPDATE__devices__SET__name__=__\'' + newTitle +'\'__WHERE__mac__=__\'' + macEdit.innerText + '\';'; 
    // console.log(updateQuery)
    if (updateQuery === undefined) {
        const err = "***** Empty Query.";
        console.error(err);
        return err;
    }

    // Check for proper format. No ' '.
    if (updateQuery.includes(' ')) {
        const err = "***** Query improper format. Replace all ' ' with '__' ";
        console.error(err);
        return err;
    }


    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "http://localhost:3000/update?" + updateQuery, true);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            // Result stored in string
            string = xmlhttp.responseText;

        }
    }
    xmlhttp.send();
}


// Call this whenever page is loaded
loadDevices();