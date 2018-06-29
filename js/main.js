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
    .then(response => response.json())
    .then(currencies => {
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

    // check if form is valid before performing any operation
    if (amount === "") {
        alert('Please fill in the amount to convert');
    } else {
        if (navigator.onLine) {
            console.log('you are online');
            console.log('currency rates will be fetched from network');
            fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`)
                .then(response => response.json())
                .then(rate => {
                    let rateVal = rate[query];
                    let result =  amount * rateVal;
                    document.getElementById("amountTo").innerHTML = result.toFixed(2);
                    // save query to idb
                    idbKeyval.set(query, rateVal)
                        .then(() => console.log('It worked!'))
                        .catch(err => console.log('It failed!', err));
                })
        } else {
            console.log('you are offline');
            console.log('currency rates will be fetched from idb');
            // get from idb
            idbKeyval.get(query)
                .then(val => {
                        console.log(`saved rate for ${query} = ${val}`);
                        let result =  amount * val;
                        document.getElementById("amountTo").innerHTML = result.toFixed(2);
                    }
                );
        }
    }
}