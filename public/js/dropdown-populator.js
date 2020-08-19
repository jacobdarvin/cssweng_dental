var request = new XMLHttpRequest();
request.open('GET', '../json/us_cities_and_states.json', true);

request.onload = function () {
    if (this.status >= 200 && this.status < 400) {
        // Success!
        var data = JSON.parse(this.response);
        var states = Object.keys(data).sort();

        console.log(data);

        var stateSelect = document.getElementById('test1');
        for (const state of states) {
            stateSelect.innerHTML += `<option value="${state}">${state}</option>`;
        }

        var citySelect = document.getElementById('test2');
        stateSelect.onchange = function (e) {
            citySelect.innerHTML = `<option value="">--Select a city--</option>`;

            var cities = data[`${stateSelect.value}`].sort();
            for (const city of cities) {
                citySelect.innerHTML += `<option value="${city}">${city}</option>`;
            }
        };
    } else {
        // We reached our target server, but it returned an error
    }
};

request.onerror = function () {
    // There was a connection error of some sort
};

request.send();
