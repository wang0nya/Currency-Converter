// get all currencies from API
const getCurrencies = new XMLHttpRequest();

getCurrencies.open('GET', 'https://free.currencyconverterapi.com/api/v5/currencies', true);
getCurrencies.onload = function () {

    // Begin accessing JSON data here
    const data = JSON.parse(this.response);
    if (getCurrencies.status >= 200 && getCurrencies.status < 400) {
        for (const currency in data.results) {
            document.getElementById("currencyFromList").innerHTML += '<option>' + currency + '</option>';
            document.getElementById("currencyToList").innerHTML += '<option>' + currency + '</option>';
        }
    } else {
        console.log('error');
    }
};

getCurrencies.send();