var dynamicList = document.getElementById("dynamicList");
var devices;


// Query devices table mac addresses & names
function loadDevices() {

    var query = "SELECT_mac,_name_FROM_devices;"

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
    xmlhttp.open("GET", "http://localhost:3000/loadDevices?" + query, true);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            // Result stored in string
            string = xmlhttp.responseText;

            // console.log("FETCHED FROM Devices: " + string);

            devices = parseString(string);
            console.log(devices);


            for(var i = 0; i < devices.length-1; i++){

                var mac = devices[i][0];
                var name = devices[i][1];
                // After we have mac addresses in the geodata table, change query to 'WHERE mac = mac' instead of 'WHERE ip = 103.76.40.123';
                var query = 'WITH_UniquePairs_AS_(SELECT_DISTINCT_ON_(lat,_lon)_*_FROM_geodata_WHERE_ip_=_\\\'103.76.40.123\\\'_ORDER_BY_lat,_lon,_ip_)_SELECT_*_FROM_UniquePairs';
                var div = '<div class="' + mac + '"><h1 class="deviceName" onclick="pullData(\'' + query + '\');updateDevice(\'' + name + '\', \'' + mac + '\')" >' + name + '</h1></div>';
        
                dynamicList.innerHTML += div;
        
            }


        }
    }
    xmlhttp.send();

}


// Call this whenever page is loaded
// 
loadDevices();