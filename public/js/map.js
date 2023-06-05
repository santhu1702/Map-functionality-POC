$(document).ready(function () {
    // const coordinates = JSON.parse($('#val').val())
    // console.log('coordinates',coordinates) 
    // const map = L.map('map').setView([coordinates[0].Latitude , coordinates[0].Longitude], 5);
    // L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     maxZoom: 19,    
    //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    // }).addTo(map); 
    // coordinates.forEach(obj => {
    //     const lat = parseFloat(obj.Latitude);
    //     const lng = parseFloat(obj.Longitude);
    //     const popupContent = `Population Density for <b>Zip</b>: ${obj.zip}: ${obj.pop_density}`;

    //     (function (content) {
    //         L.circle([lat, lng], {
    //             color: obj.drt_store ? '#ffc107' : '#0d6efd',
    //             fillOpacity: 0.5,
    //             radius: 20
    //         }).addTo(map).bindPopup(content);
    //     })(popupContent);  
    // });


    // $('.ddn_Zip').fSelect'();' 

    // const map = L.map('map').setView([51.505, -0.09], 13);
    // L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     maxZoom: 19,
    //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    // }).addTo(map);
    // // var marker = L.marker([51.5, -0.09]).addTo(map);
    // // var circle = L.circle([51.508, -0.11], {
    // //     color: 'red',
    // //     fillColor: '#f03',
    // //     fillOpacity: 0.5,
    // //     radius: 100
    // // }).addTo(map);
    // var polygon = L.polygon(ploy).addTo(map);
    // marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
    // circle.bindPopup("I am a circle.");
    // polygon.bindPopup("I am a polygon.");
    // var popup = L.popup()
    //     .setLatLng([51.513, -0.09])
    //     .setContent("I am a standalone popup.")
    //     .openOn(map); var popup = L.popup();

    // function onMapClick(e) {
    //     popup
    //         .setLatLng(e.latlng)
    //         .setContent("You clicked the map at " + e.latlng.toString())
    //         .openOn(map);
    // }

    // map.on('click', onMapClick);
});

function getZips() {
    let state = $('#ddn_State').val();

    if (state === "0") {
        return;
    }
    try {
        $.ajax({
            url: "map/getZip",
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            data: {
                state: state
            },
            success: function (result) {
                if (result.message === "fail") {
                    alert(result.message);
                    return;
                }
                $('#div_ddnZip').empty();
                var ddnZip = '<select class="form-control ddn_Zip" multiple="multiple" id="ddn_Zip">';
                for (var i = 0; i < result.length; i++) {
                    ddnZip += '<option value="' + result[i].Zip + '">' + result[i].Zip + '</option>';
                }
                ddnZip += ' </select>';
                $('#div_ddnZip').append(ddnZip);
                $('.ddn_Zip').fSelect();
                // $('#lbl_zip').show();
                $('#div_ddnZip').show();

            },
            error: function () {
                console.log("An error occurred during the AJAX request.");
            }
        });

    } catch (err) {
        console.log("Known Error:", err);
    }
}


function getStates() {
    let zip = $('#ddn_Zip').val();

    if (zip === "0") {
        alert("Please select a zip code.");
        return;
    }
    try {
        $.ajax({
            url: "map/getState",
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            data: {
                zip: zip
            },
            success: function (result) {
                if (result.message === "fail") {
                    alert(result.message);
                    return;
                }
                var ddnState = $('#ddn_State');
                ddnState.empty();
                var options = $.map(result, function (item) {
                    return $('<option>', {
                        value: item.State,
                        text: item.State
                    });
                });
                ddnState.append(options);
            },
            error: function () {
                console.log("An error occurred during the AJAX request.");
            }
        });

    } catch (err) {
        console.log("Known Error:", err);
    }
}

function getMap() {
    let zip = $('#ddn_Zip').val();
    let State = $('#ddn_State').val();
    let ACV_Est_Yearly = $('#ACV_Est_Yearly').val()

    try {
        $.ajax({
            url: "map/getMapDetailAndCoordinates",
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            data: {
                state: State,
                zip:  "" //zip.toString()
            },
            success: function (result) {
                // debugger
                if (result.message === "fail") {
                    alert(result.message);
                    return;
                }
                leafMap(result.coordinates, result.polygon[0])
            },
            error: function () {
                console.log("An error occurred during the AJAX request.");
            }
        });

    } catch (err) {
        console.log("Known Error:", err);
    }
}

function Map(cityMap) {
    // Create the map.
    const zip = new google.maps.LatLng(cityMap[0].center);
    const map = new google.maps.Map(document.getElementById("map")
        , {
            zoom: 10,
            center: zip,
            mapTypeId: "satellite",
            // styles: [
            //     // Custom style to display polylines and borders
            //     {
            //       featureType: "administrative",
            //       elementType: "geometry.stroke",
            //       stylers: [
            //         {
            //           color: "#ff0000", // Customize the border color
            //         },
            //         {
            //           weight: 2, // Customize the border weight
            //         },
            //       ],
            //     },
            //     {
            //       featureType: "road",
            //       elementType: "geometry.fill",
            //       stylers: [
            //         {
            //           color: "#00000000", // Set the road fill color to transparent
            //         },
            //       ],
            //     },
            //   ],
        }
    );

    // Construct the circle for each value in citymap.
    // Note: We scale the area of the circle based on the population.
    for (const city in cityMap) {
        // Add the circle for this city to the map.
        const cityCircle = new google.maps.Circle({
            strokeColor: "#FF0000",
            strokeOpacity: 10,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 15,
            map,
            center: cityMap[city].center,
            radius: parseFloat(cityMap[city].population) * 2000,
        });
    }
}



function leafMap(data, polygon) {
    let mapContainer = L.DomUtil.get('map');
    if (mapContainer) {
        mapContainer._leaflet_id = null;
    }

    const jsonObject = JSON.parse(polygon.geo_point_2d);
    const coordinatesArray = [jsonObject.lat, jsonObject.lon];

    const map = L.map('map')
        .setView(coordinatesArray, 5);

    const p = Object.values(JSON.parse(polygon.st_asgeojson).geometry);
    const layer = L.geoJSON({
        type: p[1], "coordinates": p[0]
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    layer.setStyle({ weight: "1", fillOpacity: 0.8, color: '#EE82EE' });
    map.addLayer(layer);
    map.fitBounds(layer.getBounds());

    data.forEach(obj => {
        const lat = parseFloat(obj.Latitude);
        const lng = parseFloat(obj.Longitude);
        const popupContent = `ACV_Est_Yearly : ${obj.ACV_Est_Yearly}`;

        (function (content) {
            L.circle([lat, lng], {
                color: obj.drt_store ? '#ffc107' : '#0d6efd',
                fillOpacity: 0.5,
                radius: 2000
            }).addTo(map).bindPopup(content);
        })(popupContent);
    });



}

