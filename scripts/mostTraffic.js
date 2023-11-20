// This file is for loading the widget that displays most traffic by device.
// It also invokes itself at the bottom of the file.

var trafficList = document.getElementById('traffic-list');

var query = 'SELECT__p.mac\,__SUM(p.len)__AS__tLen\,__d.name__FROM__packets__p__JOIN__devices__d__ON__p.mac__=__d.mac__GROUP__BY__p.mac\,__d.name__ORDER__BY__tLen__DESC;';

function loadTraffic() {

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
    xmlhttp.open("GET", "http://localhost:3000/loadTraffic?" + query, true);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            // Result stored in string
            string = xmlhttp.responseText;

            devices = parseString(string);
            // console.log(devices);

            //deconstruct the result passed back from the database into strings, that are used to populate the most traffic widget
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