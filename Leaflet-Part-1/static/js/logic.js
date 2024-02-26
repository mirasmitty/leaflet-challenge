// Function to create the map
function createMap() {
    // Create the map object
    const myMap = L.map('map').setView([0, 0], 2);
  
    // Add the tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);
  
    // Call function to get earthquake data
    console.log("Fetching earthquake data...");
    getEarthquakeData(myMap);
    
    // Add legend
    addLegend(myMap);
}

// Function to get earthquake data and create markers
function getEarthquakeData(map) {
    // Use D3 to fetch GeoJSON data from the USGS API
    d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson")
      .then(function(data) {
        console.log("Received earthquake data:", data);
        // Loop through the features array and create markers
        data.features.forEach(feature => {
          console.log("Processing feature:", feature);
          const coordinates = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
          const magnitude = feature.properties.mag;
          const depth = feature.geometry.coordinates[2];
  
          // Create a circle marker with size and color based on magnitude and depth
          const circleMarker = L.circle(coordinates, {
            radius: magnitude * 50000, 
            fillColor: getColorBasedOnDepth(depth),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          }).addTo(map);
  
          // Add a popup with information
          circleMarker.bindPopup(`<b>Location:</b> ${feature.properties.place}<br><b>Magnitude:</b> ${magnitude}<br><b>Depth:</b> ${depth} km`);
        });
      })
      .catch(function(error) {
        console.error("Error fetching earthquake data:", error);
      });
}

// Function to get color based on depth
function getColorBasedOnDepth(depth) {
    const colors = ['#FFFFFF', '#FFFF00', '#FFA500', '#FF4500', '#FF0000', '#800000'];
    const depthRanges = [0, 50, 100, 150, 200, 300];
    
    // Find the appropriate color based on the depth
    for (let i = 0; i < depthRanges.length; i++) {
      if (depth <= depthRanges[i]) {
        return colors[i];
      }
    }
  
    return colors[colors.length - 1]; 
}

// Function to add legend
function addLegend(map) {
    const legend = L.control({ position: 'bottomright' });
  
    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'info legend');
        const depthRanges = [0, 50, 100, 150, 200, 300];
        const colors = ['#FFFFFF', '#FFFF00', '#FFA500', '#FF4500', '#FF0000', '#800000'];
  
        // Loop through depth ranges and generate HTML for legend
        for (let i = 0; i < depthRanges.length; i++) {
            const color = colors[i];
            div.innerHTML +=
                '<div style="display: inline-block; margin-right: 10px;">' +
                '<i style="background:' + color + '"></i> ' +
                depthRanges[i] + (depthRanges[i + 1] ? '&ndash;' + (depthRanges[i + 1] - 1) + ' km</div>' : '+ km</div>');
        }
  
        return div;
    };
  
    legend.addTo(map);

    // CSS for the legend
    const legendStyle = document.createElement('style');
    legendStyle.innerHTML = `
        .info.legend i {
            width: 20px;
            height: 20px;
            float: left;
            margin-right: 8px;
            opacity: 0.7;
        }
    `;
    document.getElementsByTagName('head')[0].appendChild(legendStyle);
}





// Call the createMap function when the document is ready
document.addEventListener('DOMContentLoaded', createMap);

  