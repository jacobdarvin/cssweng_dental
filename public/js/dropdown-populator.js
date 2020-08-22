// Populates the city <select> element with the appropriate cities given a state
function populateCities(state, citySelectIdAttribute) {
    var citySelect = document.getElementById(citySelectIdAttribute);
    citySelect.innerHTML = `<option value="">--Select a city--</option>`;

    // Send an AJAX request to /cities?state=state
    var request = new XMLHttpRequest();
    request.open('GET', `/cities?state=${state}`, true);

    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            // Success!
            var cities = JSON.parse(this.response);
            for (const city of cities) {
                citySelect.innerHTML += `<option value="${city}">${city}</option>`;
            }

            console.log(cities);
        } else {
            // We reached our target server, but it returned an error
        }
    };

    request.onerror = function () {
        // There was a connection error of some sort
    };

    request.send();

    console.log(state);
    console.log(citySelectIdAttribute);
}
