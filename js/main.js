// register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/Currency-Converter/sw.js').then(registration => {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, err => {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// get all currencies from API
const getCurrencies = new XMLHttpRequest();

getCurrencies.open('GET', 'https://free.currencyconverterapi.com/api/v5/currencies', true);
getCurrencies.onload = function () {

    // Begin accessing JSON data here
    let data = JSON.parse(this.response);
    if (getCurrencies.status >= 200 && getCurrencies.status < 400) {
        for (const currency in data.results) {
            document.getElementById("currencyFromList").innerHTML += `<option>${currency}</option>`;
            document.getElementById("currencyToList").innerHTML += `<option>${currency}</option>`;
        }
    } else {
        console.log('error');
    }
};

getCurrencies.send();

// convert selected currencies
const convertCurrencies = new XMLHttpRequest();

function convert() {
    let from = document.getElementById("currencyFromList");
    from = from.options[from.selectedIndex].text;
    let to = document.getElementById("currencyToList");
    to = to.options[to.selectedIndex].text;
    const amount = document.getElementById("amountFrom").value;
    const query = `${from}_${to}`;
    convertCurrencies.open('GET', `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`, true);
    convertCurrencies.onload = function () {
        // Begin accessing JSON data here
        let data = JSON.parse(this.response);
        const rate = data[query];
        // save data in idb
        idbKeyval.set(query, rate)
            .then(() => console.log('It worked!'))
            .catch(err => console.log('It failed!', err));
        // if data exists in idb, get from there
        idbKeyval.get(query)
            .then(rate => {
                if (rate) {
                    render(rate);
                }
            });
        if (convertCurrencies.status >= 200 && convertCurrencies.status < 400) {
            const result =  amount * rate;
            document.getElementById("amountTo").value = result.toFixed(2);
        } else {
            console.log('error');
        }
    };

    convertCurrencies.send()
}