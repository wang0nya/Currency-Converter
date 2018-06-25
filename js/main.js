const request = new XMLHttpRequest();

request.open('GET', 'https://free.currencyconverterapi.com/api/v5/currencies', true);
request.onload = function () {

    // Begin accessing JSON data here
    const data = JSON.parse(this.response);
    console.log('data ==>', data);
};

request.send();