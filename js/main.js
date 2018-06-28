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
fetch('https://free.currencyconverterapi.com/api/v5/currencies')
    .then(function(response) {
        return response.json();
    })
    .then(function(currencies) {
        for (const currency in currencies.results) {
            document.getElementById("currencyFromList").innerHTML += `<option>${currency}</option>`;
            document.getElementById("currencyToList").innerHTML += `<option>${currency}</option>`;
        }
    });

// convert selected currencies
function convert() {
    let from = document.getElementById("currencyFromList");
    from = from.options[from.selectedIndex].text;
    let to = document.getElementById("currencyToList");
    to = to.options[to.selectedIndex].text;
    const amount = document.getElementById("amountFrom").value;
    const query = `${from}_${to}`;
    fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`)
        .then(function (response) {
            return response.json();
        })
        .then(function (rate) {
            const rateVal = rate[query];
            const result =  amount * rateVal;
            document.getElementById("amountTo").value = result.toFixed(2);
        });
}