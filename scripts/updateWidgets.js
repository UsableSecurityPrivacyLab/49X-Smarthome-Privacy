var widget1 = document.getElementById('card4');
var titleCard = document.getElementById('current-device');



function updateAll(){
    widget1.style.visibility = 'visible'
    titleCard.innerText = 'All Devices'
}

function updateDevice(name, mac){
    widget1.style.visibility = 'hidden';
    titleCard.innerText = name;
}
