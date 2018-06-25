const request = new XMLHttpRequest();

request.open('GET', 'https://free.currencyconverterapi.com/api/v5/currencies', true);
request.onload = function () {

    // Begin accessing JSON data here
    const data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
        for (const currency in data.results) {
            document.getElementById("currencyFromList").innerHTML += '<option>' + currency + '</option>';
            document.getElementById("currencyToList").innerHTML += '<option>' + currency + '</option>';
        }
    } else {
        console.log('error');
    }
};

request.send();