var widget1 = document.getElementById('card4');
var titleCard = document.getElementById('current-device');
var editButton = document.getElementById('edit-title');
var macEdit = document.getElementById('mac-edit');



function updateAll(){
    editButton.style.visibility = 'hidden';
    widget1.style.visibility = 'visible';
    titleCard.innerText = 'All Devices';
    macEdit.innerText = '';
}

function updateDevice(name, mac){
    editButton.style.visibility = 'visible';
    widget1.style.visibility = 'hidden';
    titleCard.innerText = name;
    macEdit.innerText = mac;
}
