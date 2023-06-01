$(document).ready(function () {
    $('#ddn_Zip').multiselect({
        includeSelectAllOption: true,
    });
    setMultiSelectDropdowns();

    //     const map = L.map('map').setView([51.505, -0.09], 13); 
    //     const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //       maxZoom: 19,
    //       attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    //     }).addTo(map);
    //     var marker = L.marker([51.5, -0.09]).addTo(map);
    //     var circle = L.circle([51.508, -0.11], {
    //     color: 'red',
    //     fillColor: '#f03',
    //     fillOpacity: 0.5,
    //     radius: 100
    // }).addTo(map);
});
function setMultiSelectDropdowns() {
    $('.ms-multi').multiselect({
      includeSelectAllOption: true,
      selectAllValue: 0,
      enableFiltering: true,
      enableCaseInsensitiveFiltering: true
    });
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
            url: "map/getMapDetails",
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            data: {
                ACV_Est_Yearly: ACV_Est_Yearly
            },
            success: function (result) {
                debugger
                if (result.message === "fail") {
                    alert(result.message);
                    return;
                }
                var convertedData = result.map(function (item) {
                    return {
                        center: {
                            lat: item.Latitude,
                            lng: -item.Longitude
                        },
                        population: item.ACV_Est_Yearly
                    };
                });
                Map(convertedData)
                console.log(convertedData)
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
    const map = new google.maps.Map(document.getElementById("map")
        , {
            zoom: 4,
            center: { lat: 40.868, lng: -73.0241 },
            mapTypeId: "terrain",
        }
    );

    // Construct the circle for each value in citymap.
    // Note: We scale the area of the circle based on the population.
    for (const city in cityMap) {
        // Add the circle for this city to the map.
        const cityCircle = new google.maps.Circle({
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            map,
            center: cityMap[city].center,
            radius: Math.sqrt(cityMap[city].population) * 100,
        });
    }
}