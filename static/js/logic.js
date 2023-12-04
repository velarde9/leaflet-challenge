// Create the map object
let myMap = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 5
});

// Add title layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Store our API endpoint as queryUrl
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform GET request to queryUrl
d3.json(queryUrl).then(function (data) {
    
    console.log(data)
    
    function calculateRadius(magnitude) {
        if (magnitude <= 0) {
            magnitude = 0.01;
        }

        return magnitude * 10000;
    }

    function selectColour(depth) {
        if (depth < 10)
            return "green";
        else if (depth < 30) 
            return "yellowgreen";
        else if (depth < 50) 
            return "yellow";
        else if (depth < 70) 
            return "orange";
        else if (depth < 90) 
            return "red";
        else
            return "purple";
    }
    
    features = data.features;
    // Create GeoJSON layer
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
        // Create marker styles
            var markers = {
                radius: calculateRadius(feature.properties.mag),
                fillColor: selectColour(feature.geometry.coordinates[2]),
                fillOpacity: 0.7,
                color: "black",
                stroke: true,
                weight: 0.5
        }
        return L.circle(latlng,markers);
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
        }
    }).addTo(myMap);


    // Create legend
    let info = L.control({
        position: "bottomright"
    });
    
    // Add div class for legend
    info.onAdd = function() {
        let div = L.DomUtil.create("div", "legend");
        return div;
    };
    // Add legend to map
    info.addTo(myMap);
    document.querySelector(".legend").innerHTML = [
        "<p id=\"legendLabel1\"><span class=\"legendbox1\"></span>< 10</p>" 
        + "<p id=\"legendLabel2\"><span class=\"legendbox2\"></span>< 30</p>"
        + "<p id=\"legendLabel3\"><span class=\"legendbox3\"></span>< 50</p>"
        + "<p id=\"legendLabel4\"><span class=\"legendbox4\"></span>< 70</p>"
        + "<p id=\"legendLabel5\"><span class=\"legendbox5\"></span>< 90</p>"
        + "<p id=\"legendLabel6\"><span class=\"legendbox6\"></span>> 90</p>" 
      ].join("");
  });


// Function for marker size ~ population size
function markerSize(magnitude) {
    return Math.sqrt(magnitude) * 50;
  }

