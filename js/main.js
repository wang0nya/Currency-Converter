// get all currencies from API
const getCurrencies = new XMLHttpRequest();

getCurrencies.open('GET', 'https://free.currencyconverterapi.com/api/v5/currencies', true);
getCurrencies.onload = function () {

    // Begin accessing JSON data here
    let data = JSON.parse(this.response);
    if (getCurrencies.status >= 200 && getCurrencies.status < 400) {
        for (const currency in data.results) {
            document.getElementById("currencyFromList").innerHTML += '<option value=`this.currency`>' + currency + '</option>';
            document.getElementById("currencyToList").innerHTML += '<option value="PHP">' + currency + '</option>';
        }
    } else {
        console.log('error');
    }
};

getCurrencies.send();

// convert selected currencies
const convertCurrencies = new XMLHttpRequest();

function convert() {
    const from = document.getElementById("currencyFromList");
    const fromValue = from.options[from.selectedIndex].text;
    const to = document.getElementById("currencyToList");
    const toValue = to.options[to.selectedIndex].text;
    convertCurrencies.open('GET', `https://free.currencyconverterapi.com/api/v5/convert?q=${fromValue}_${toValue}&compact=y`, true);
    convertCurrencies.onload = function () {
        // Begin accessing JSON data here
        let data = JSON.parse(this.response);
        if (convertCurrencies.status >= 200 && convertCurrencies.status < 400) {
            console.log(data);

        } else {
            console.log('error');
        }
    };

    convertCurrencies.send()
}