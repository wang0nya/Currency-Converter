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
        for (let currency in currencies.results) {
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
    let amount = document.getElementById("amountFrom").value;
    let query = `${from}_${to}`;

    // check if form is valid before performing any operation
    if (amount === "") {
        alert('Please fill in the amount to convert');
    } else {
        if (navigator.onLine) {
            console.log('you are online');
            // check if query exists in idb
            // if exists, get from idb
            // if not, get from network and add to idb
            idbKeyval.get(query).then(val => {
                if (val === undefined) {
                    console.log('query not in idb. it will be fetched from the network');
                    // fetch from network
                    fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`)
                        .then(response => response.json())
                        .then(rate => {
                            let rateVal = rate[query];
                            let result = amount * rateVal;
                            document.getElementById("amountTo").innerHTML = result.toFixed(2);
                            // save query to idb
                            idbKeyval.set(query, rateVal)
                                .then(() => console.log('query added to idb and will be fetched from there next time!'))
                                .catch(err => console.log('It failed!', err));
                        })
                } else {
                    console.log('query in idb! val =', val);
                    // get from idb
                    idbKeyval.get(query)
                        .then(val => {
                                console.log(`saved rate for ${query} = ${val}`);
                                console.log('fetched from idb');
                                let result =  amount * val;
                                document.getElementById("amountTo").innerHTML = result.toFixed(2);
                            }
                        );
                }
            });
        } else {
            console.log('you are offline');
            // get from idb
            idbKeyval.get(query)
                .then(val => {
                    // check if query exists in db
                    if (val === undefined) {
                        console.log('query not in idb yet.');
                        document.getElementById("amountTo").innerHTML = '<p class="text-danger">Query not in database</p>';
                    } else {
                        console.log(`saved rate for ${query} = ${val}`);
                        let result =  amount * val;
                        document.getElementById("amountTo").innerHTML = result.toFixed(2);
                    }
                });
        }
    }
}