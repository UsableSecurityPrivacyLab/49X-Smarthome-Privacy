var btn1 = document.getElementById("editBtn1");
var btn2 = document.getElementById("editBtn2");

var title1 = document.getElementById("nameDiv1");
var title2 = document.getElementById("nameDiv2");

var editMode1 = 0;
var editMode2 = 0;

btn1.addEventListener("click", function() {

    if(editMode1 == 0) {
        btn1.style.backgroundColor = "rgb(0, 255, 0)";
        title1.contentEditable = "true";
        editMode1 = 1;

        title1.classList.toggle("deviceName");

    } else if(editMode1 == 1) {
        btn1.style.backgroundColor = "rgb(255, 255, 255)";
        title1.contentEditable = "false";
        editMode1 = 0;

        title1.classList.toggle("deviceName");
    }
    
});

btn2.addEventListener("click", function() {

    if(editMode2 == 0) {
        btn2.style.backgroundColor = "rgb(0, 255, 0)";
        title2.contentEditable = "true";
        editMode2 = 1;

        title2.classList.toggle("deviceName");
    } else if(editMode2 == 1) {
        btn2.style.backgroundColor = "rgb(255, 255, 255)";
        title2.contentEditable = "false";
        editMode2 = 0;

        title2.classList.toggle("deviceName");
    }
    
});


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

            var rows = parseString(string);
            console.log(rows);


        }
    }
    xmlhttp.send();
}

// Call this whenever page is loaded
// 
// loadDevices();