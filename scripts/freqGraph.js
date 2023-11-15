
var macDiv = document.getElementById("mac-edit")

function loadFreqGraph(timerange) {
// Reset timeDates and timeCounts
for(var j = 0; j < timeDates.length; j++){
    timeDates[j] = 0;
}
for(var j = 0; j < timeCounts.length; j++){
    timeCounts[j] = 0;
}

// create query based on timestamp
let currentDate = new Date();
if(timerange == 'hour'){
    currentDate.setHours(currentDate.getHours() - 1);
}
else if(timerange == 'day'){
    currentDate.setDate(currentDate.getDate() - 1);
}
else if(timerange == 'month'){
    currentDate.setMonth(currentDate.getMonth() - 1);
}

let formattedTimestamp = currentDate.toISOString().slice(0, -5);
formattedTimestamp = formattedTimestamp.split('-').join('__');

    var mac = macDiv.innerText;
    
    if(timerange == 'hour'){
        
        if(mac){
            var query = "SELECT__TO_CHAR(DATE_TRUNC(\'minute\'\,__time)\,__\'HH24:MI\')__AS__minute\,__COUNT(*)__AS__count__FROM__packets__WHERE__mac__=__\'" + mac + "\'__AND__time__\>__\'" + formattedTimestamp + "\'__GROUP__BY__minute__ORDER__BY__minute;"
            console.log(query);
        }else{
            var query = "SELECT__TO_CHAR(DATE_TRUNC(\'minute\'\,__time)\,__\'HH24:MI\')__AS__minute\,__COUNT(*)__AS__count__FROM__packets__WHERE__time__\>__\'" + formattedTimestamp + "\'__GROUP__BY__minute__ORDER__BY__minute;"
            console.log(query);
        }
    }
    else if(timerange == 'day'){

    }
    else if(timerange == 'month'){

    }
    else{
        // Default query, selects all packets sorted into 30 groups.
        var query = "SELECT__TO_CHAR(DATE_TRUNC(\'minute\'\,__time)\,__\'HH24:MI\')__AS__minute\,__COUNT(*)__AS__count__FROM__packets__GROUP__BY__minute__ORDER__BY__minute;"
    }

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


    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "http://localhost:3000/packets?" + query, true);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            // Result stored in string
            string = xmlhttp.responseText;

            var data = parseString(string);
            console.log(data);

            for(var i = 0; i < data.length-1; i++){
                data[i][0] = data[i][0]
            }


            for(var i = 0; i < data.length-1; i++){
                timeDates[i] = data[i][0];
                timeCounts[i] = data[i][1];
            }

        }
    }
    xmlhttp.send();

}