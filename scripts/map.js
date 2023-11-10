    const world = new jsVectorMap({
        selector: '#map1',
        backgroundColor: '#253D5B',
        markers: [],
        onMarkerClick: function (event, index) {

            console.log(markerData);
            console.log(index);

            var markerOrg = document.getElementById("org");
            var markerIP = document.getElementById("ip");
            var markerRegion = document.getElementById("region");
            var markerDomain = document.getElementById("domain");

            markerOrg.innerText = "Organization: " + markerData[index].org;
            markerIP.innerText = "IP Address: " + markerData[index].ip;
            markerRegion.innerText = "Region: " + markerData[index].region;
            markerDomain.innerText = "Domain: " + markerData[index].domain;
        },

        markerStyle: {
            initial: {
                stroke: 'white',
                strokeWidth: 2.5,
                fill: '#8ce7f5',
                fillOpacity: 1
            },
            hover: {
                fill: '#06b8d4',
            },
        },

        regionStyle: {
            initial: {
                fill: '#67697C',
                stroke: "#676767",
                strokeWidth: 0.3,
                fillOpacity: 1
            }
        }
    })
