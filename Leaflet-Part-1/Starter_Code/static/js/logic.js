// Creating the map object
let myMap = L.map("map", {
    center: [0,0],
    zoom: 2
});

//Step 1: Define the base layer
// Adding the tile Layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Step-2: get the data
// Store the API query variable
let baseURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Get the data with d3
d3.json(baseURL).then(function(data) {
    // Setting marker size based on the magnitude of the earthquake
    function markerSize(magnitude) {
        return magnitude * 60000;
    }

    // Setting marker color based on depth of the earthquake
    function markerColor(depth) {
        if (depth > 90) {
            return 'rgb(255,95,101)';
        } else if (depth > 70) {
            return 'rgb(252,163,93)';
        } else if (depth > 50) {
            return 'rgb(253,183,42)';
        } else if (depth > 30) {
            return 'rgb(247,219,17)';
        } else if (depth > 10) {
            return 'rgb(220,244,0)';
        } else {
            return 'rgb(163,246,0)';
        }
    }

function createData(earthquakeData) {
    let earthquakes = [];
    for (let i = 0; i < earthquakeData.length; i++) {
        let lat = earthquakeData[i].geometry.coordinates[1];
        let long = earthquakeData[i].geometry.coordinates[0];
        let entry = L.circle([lat, long], {
            stroke: true,
            weight: 1,
            fillOpacity: 0.75,
            color: 'black',
            fillColor: markerColor(earthquakeData[i].geometry.coordinates[2]),
            radius: markerSize(earthquakeData[i].properties.mag)
        });
        entry.bindPopup(`<h3>${earthquakeData[i].properties.place}</h3>
            <p>Depth: ${earthquakeData[i].geometry.coordinates[2]}<br>
            Magnitude: ${earthquakeData[i].properties.mag}<br>
            Time: ${Date(earthquakeData[i].properties.time)}<br>
            </p>`);
        earthquakes.push(entry);
    }
    earthquakeLayer = L.layerGroup(earthquakes);
    myMap.addLayer(earthquakeLayer);
}

createData(data.features);

// Create legend for the map
let legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
    let div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<i style="background: rgb(163,246,0)"></i>-10-10<br>';
    div.innerHTML += '<i style="background: rgb(220,244,0)"></i>10-30<br>';
    div.innerHTML += '<i style="background: rgb(247,219,17)"></i>30-50<br>';
    div.innerHTML += '<i style="background: rgb(253,183,42)"></i>50-70<br>';
    div.innerHTML += '<i style="background: rgb(252,163,93)"></i>70-90<br>';
    div.innerHTML += '<i style="background: rgb(255,95,101)"></i>90+<br>';
    return div;
};
legend.addTo(myMap);
});