var trafficList = document.getElementById('traffic-list');

var query = 'SELECT_p.mac\,_SUM(p.len)_AS_tLen\,_d.name_FROM_packets_p_JOIN_devices_d_ON_p.mac_=_d.mac_GROUP_BY_p.mac\,_d.name_ORDER_BY_tLen_DESC;';

function loadTraffic() {

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
    xmlhttp.open("GET", "http://localhost:3000/loadTraffic?" + query, true);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            // Result stored in string
            string = xmlhttp.responseText;

            devices = parseString(string);
            // console.log(devices);


            trafficList.innerHTML = '';
            for(var i = 0; i < devices.length-1; i++){

                var mac = devices[i][0];
                var traf = devices[i][1]
                var name = devices[i][2];
                
                var div = '<li>' + name + '<br>MAC: ' + mac + '<br> Total Traffic: ' + traf + 'KB</li>';
                trafficList.innerHTML += div;
        
            }


        }
    }
    xmlhttp.send();

}

setTimeout(function(){
    loadTraffic();
}, 100);