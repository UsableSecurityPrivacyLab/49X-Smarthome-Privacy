var widget1 = document.getElementById('card4');
var titleCard = document.getElementById('current-device');
var editButton = document.getElementById('edit-title');
var macEdit = document.getElementById('mac-edit');

//updateAll runs when the all button is selected. It pulls data to populate the map and also loads the frequency graph.
//updateDevice runs when a device is selected. It pulls data to populate the map and also loads the frequency graph.

function updateAll(queryGeodata){
    editButton.style.visibility = 'hidden';
    widget1.style.visibility = 'visible';
    titleCard.innerText = 'All Devices';
    macEdit.innerText = '';
    setTimeout(function(){
        pullData(queryGeodata);
    }, 100);
    loadFreqGraph('month');
}

function updateDevice(name, mac, queryGeodata){
    editButton.style.visibility = 'visible';
    widget1.style.visibility = 'hidden';
    titleCard.innerText = name;
    macEdit.innerText = mac;
    setTimeout(function(){
        pullData(queryGeodata);
    }, 100);
    loadFreqGraph('month');
}
