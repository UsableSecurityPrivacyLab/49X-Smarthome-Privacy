
var macDiv = document.getElementById("mac-edit")

function loadFreqGraph(timerange) {

// create query based on timestamp
    const now = new Date();
    
    // Get year, month, and day
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const lastMonth = String(now.getMonth()).padStart(2, '0'); // Months are zero-based
    const day = String(now.getDate()).padStart(2, '0');
    const yesterday = String(now.getDate()-1).padStart(2, '0');

    // Get hours, minutes, and seconds
    const hours = String(now.getHours()).padStart(2, '0');
    const lastHour = String(now.getHours()).padStart(2, '0');  
    const minutes = String(now.getMinutes()).padStart(2, '0');
  
    // Construct the timestamp strings, corresponding to different time ranges
    const minuteString = `${year}-${month}-${day}__${lastHour}:${minutes}`;
    const hourString = `${year}-${month}-${yesterday}__${hours}:${minutes}`;
    const dayString = `${year}-${lastMonth}-${day}__${hours}:${minutes}`;

    var mac = macDiv.innerText;

    //resets the data in the graph before new data is added
    data = [];
    timeDates = [];
    timeCounts = [];
    
    //queries data based on the selected timescale and if a device is selected.
    if(timerange == 'hour'){
        if(mac){
            var query = "SELECT__TO_CHAR(DATE_TRUNC(\'minute\'\,__time)\,__\'HH24:MI\')__AS__minute\,__COUNT(*)__AS__count__FROM__packets__WHERE__mac__=__\'" + mac + "\'__AND__time__\>__\'" + minuteString + "\'::timestamp__GROUP__BY__minute__ORDER__BY__minute;"
            console.log(query);
        }else{
            var query = "SELECT__TO_CHAR(DATE_TRUNC(\'minute\'\,__time)\,__\'HH24:MI\')__AS__minute\,__COUNT(*)__AS__count__FROM__packets__WHERE__time__\>__\'" + minuteString + "\'::timestamp__GROUP__BY__minute__ORDER__BY__minute;"
            console.log(query);
        }
    }
    else if(timerange == 'day'){
        if(mac){
            var query = "SELECT__TO_CHAR(DATE_TRUNC(\'minute\'\,__time)\,__\'MM\-DD__HH24:00\')__AS__minute\,__COUNT(*)__AS__count__FROM__packets__WHERE__mac__=__\'" + mac + "\'__AND__time__\>__\'" + hourString + "\'::timestamp__GROUP__BY__minute__ORDER__BY__minute;"
            console.log(query);
        }else{
            var query = "SELECT__TO_CHAR(DATE_TRUNC(\'minute\'\,__time)\,__\'MM\-DD__HH24:00\')__AS__minute\,__COUNT(*)__AS__count__FROM__packets__WHERE__time__\>__\'" + hourString + "\'::timestamp__GROUP__BY__minute__ORDER__BY__minute;"
            console.log(query);
        }
    }
    else if(timerange == 'month'){
        if(mac){
            var query = "SELECT__TO_CHAR(DATE_TRUNC(\'minute\'\,__time)\,__\'MM-DD\')__AS__minute\,__COUNT(*)__AS__count__FROM__packets__WHERE__mac__=__\'" + mac + "\'__AND__time__\>__\'" + dayString + "\'::timestamp__GROUP__BY__minute__ORDER__BY__minute;"
            console.log(query);
        }else{
            var query = "SELECT__TO_CHAR(DATE_TRUNC(\'minute\'\,__time)\,__\'MM-DD\')__AS__minute\,__COUNT(*)__AS__count__FROM__packets__WHERE__time__\>__\'" + dayString + "\'::timestamp__GROUP__BY__minute__ORDER__BY__minute;"
            console.log(query);
        }
    }
    else{
        // Default query, selects all packets sorted into 30 groups.
        var query = "SELECT__TO_CHAR(DATE_TRUNC(\'minute\'\,__time)\,__\'HH24:MI\')__AS__minute\,__COUNT(*)__AS__count__FROM__packets__GROUP__BY__minute__ORDER__BY__minute;"
        //var query = "SELECT__TO_CHAR(DATE_TRUNC(\'minute\'\,__time)\,__\'MM__DD\')__AS__minute\,__COUNT(*)__AS__count__FROM__packets__GROUP__BY__minute__ORDER__BY__minute;"
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

// loadFreqGraph('month');