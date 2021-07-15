const axios = require('axios');
const mongoose = require('mongoose');
const fetch = require('node-fetch');

var db2 =  mongoose.createConnection('mongodb://localhost/optionDebug', {useNewUrlParser: true});
var today = new Date();
var optionsDebugModel;
var optionsDebugSchema = mongoose.Schema({
    name: String,
    dateOfIssue: String,
    error: String
},
{timestamps: { createdAt: 'created_at'}});



mongoose.connect('mongodb://localhost/options', {useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
var option;

db.on('error', console.error.bind(console, 'connection error: '));

db.once('open', function() {

  db.dropCollection('options', function(err, result){
    if(err) return console.error(err);
    console.log("dropped collection");    
  });

  var optionSchema = mongoose.Schema({
    symbol: String,
    name: String,
    price: String,
    iv_rank: String,
    total_volume: String,
    put_volume_pct: String,
    call_volume_pct: String,
    put_call_ratio: String,
    time: String
  });

  var optionModel = mongoose.model('option', optionSchema);

  var laravel_token;
  var xsrf_token_url;
  var xsrf_token_non_url;
  var laravel_session;
  var market;

  fetch('https://www.barchart.com/options/most-active/stocks')
  .then(res =>{ 
    laravel_token = res.headers.raw()['set-cookie'][0].slice(res.headers.raw()['set-cookie'][0].indexOf("=") + 1, res.headers.raw()['set-cookie'][0].indexOf(";"));
    laravel_session = res.headers.raw()['set-cookie'][2].slice(res.headers.raw()['set-cookie'][2].indexOf("=") + 1, res.headers.raw()['set-cookie'][2].indexOf(";"));
    market = res.headers.raw()['set-cookie'][3].slice(res.headers.raw()['set-cookie'][3].indexOf("=") + 1, res.headers.raw()['set-cookie'][3].indexOf(";"));
    xsrf_token_url = res.headers.raw()['set-cookie'][1].slice(res.headers.raw()['set-cookie'][1].indexOf("=") + 1, res.headers.raw()['set-cookie'][1].indexOf(";"));
    xsrf_token_non_url = decodeURIComponent(xsrf_token_url);

    //10 most popular call options
    fetch("https://www.barchart.com/proxies/core-api/v1/quotes/get?list=options.mostActive.us&fields=symbol%2CsymbolType%2CsymbolName%2ChasOptions%2ClastPrice%2CpriceChange%2CpercentChange%2CoptionsImpliedVolatilityRank1y%2CoptionsTotalVolume%2CoptionsPutVolumePercent%2CoptionsCallVolumePercent%2CoptionsPutCallVolumeRatio%2CtradeTime%2CsymbolCode&orderBy=optionsCallVolumePercent&orderDir=desc&between(lastPrice%2C.10%2C)=&between(tradeTime%2C2021-07-06%2C2021-07-07)=&meta=field.shortName%2Cfield.type%2Cfield.description&hasOptions=true&page=1&limit=10&raw=1", {
    "headers": {
      "accept": "application/json",
      "accept-language": "en-US,en;q=0.9",
      "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-xsrf-token": xsrf_token_non_url,
      "cookie": "_gcl_au=1.1.1370323724.1625621218; usprivacy=1---;" + 
                " _ga=GA1.2.1158816038.1625621219;" +
                " _gid=GA1.2.483804253.1625621219;" +
                " _admrla=2.2-62ee74440ce650ab-6cf10fe8-dec2-11eb-8856-cd07be91fbf3;" +
                " __qca=P0-689732296-1625621221371;" +
                " candles-07142021WebinarClosed=true;" +
                " market=" + market + ";" +
                " bcFreeUserPageView=0; IC_ViewCounter_www.barchart.com=1;" +
                " __aaxsc=1; aasd=3%7C1625789785382;" +
                " _awl=2.1625789786.0.4-ba6f7c4a-9dddd5e6e40bc28c898a7ad1e56e4f52-6763652d75732d63656e7472616c31-60e7955a-1;" +
                " laravel_token=" + laravel_token + ";" +
                " XSRF-TOKEN=" + xsrf_token_url + ";" +
                " laravel_session=" + laravel_session
    },
    "referrer": "https://www.barchart.com/options/most-active/stocks",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors"
  }).then(res => res.json())
  .then(output => {
    for(x in output.data){
        option = new optionModel({
          symbol: output.data[x]["symbol"],
          name: output.data[x]["symbolName"],
          price: output.data[x]["lastPrice"],
          iv_rank: output.data[x]["optionsImpliedVolatilityRank1y"],
          total_volume: output.data[x]["optionsTotalVolume"],
          put_volume_pct: output.data[x]["optionsPutVolumePercent"],
          call_volume_pct: output.data[x]["optionsCallVolumePercent"],
          put_call_ratio: output.data[x]["optionsPutCallVolumeRatio"],
          time: output.data[x]["tradeTime"]  
      });

      option.save(function (err, option) {
          if(err) return console.error(err);
          console.log("saved:" + output.data[x]["symbolName"])
      });

    }


  })
  .catch(error => { 

    console.log(error);

        today = String(today.getDate()).padStart(2, '0') + '/' + //dd
                String(today.getMonth() + 1).padStart(2, '0') + '/' + //mm
                today.getFullYear(); //yyyy

        optionsDebugModel = db2.model('options_debug', optionsDebugSchema);

        optionsDebugModel.create({
            name: 'Options_Call',
            dateOfIssue: today,
            error: error.toString()
        });


  });

  //10 most popular put options
  fetch("https://www.barchart.com/proxies/core-api/v1/quotes/get?list=options.mostActive.us&fields=symbol%2CsymbolType%2CsymbolName%2ChasOptions%2ClastPrice%2CpriceChange%2CpercentChange%2CoptionsImpliedVolatilityRank1y%2CoptionsTotalVolume%2CoptionsPutVolumePercent%2CoptionsCallVolumePercent%2CoptionsPutCallVolumeRatio%2CtradeTime%2CsymbolCode&orderBy=optionsPutVolumePercent&orderDir=desc&between(lastPrice%2C.10%2C)=&between(tradeTime%2C2021-07-06%2C2021-07-07)=&meta=field.shortName%2Cfield.type%2Cfield.description&hasOptions=true&page=1&limit=10&raw=1", {
    "headers": {
      "accept": "application/json",
      "accept-language": "en-US,en;q=0.9",
      "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-xsrf-token": xsrf_token_non_url,
      "cookie": "_gcl_au=1.1.1370323724.1625621218; usprivacy=1---;" + 
                " _ga=GA1.2.1158816038.1625621219;" +
                " _gid=GA1.2.483804253.1625621219;" +
                " _admrla=2.2-62ee74440ce650ab-6cf10fe8-dec2-11eb-8856-cd07be91fbf3;" +
                " __qca=P0-689732296-1625621221371;" +
                " candles-07142021WebinarClosed=true;" +
                " market=" + market + ";" +
                " bcFreeUserPageView=0; IC_ViewCounter_www.barchart.com=1;" +
                " __aaxsc=1; aasd=3%7C1625789785382;" +
                " _awl=2.1625789786.0.4-ba6f7c4a-9dddd5e6e40bc28c898a7ad1e56e4f52-6763652d75732d63656e7472616c31-60e7955a-1;" +
                " laravel_token=" + laravel_token + ";" +
                " XSRF-TOKEN=" + xsrf_token_url + ";" +
                " laravel_session=" + laravel_session
    },
    "referrer": "https://www.barchart.com/options/most-active/stocks",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors"
  }).then(res => res.json())
  .then(output => {
    for(const x in output.data){

        option = new optionModel({
          symbol: output.data[x]["symbol"],
          name: output.data[x]["symbolName"],
          price: output.data[x]["lastPrice"],
          iv_rank: output.data[x]["optionsImpliedVolatilityRank1y"],
          total_volume: output.data[x]["optionsTotalVolume"],
          put_volume_pct: output.data[x]["optionsPutVolumePercent"],
          call_volume_pct: output.data[x]["optionsCallVolumePercent"],
          put_call_ratio: output.data[x]["optionsPutCallVolumeRatio"],
          time: output.data[x]["tradeTime"]  
      });

      option.save(function (err, option) {
          if(err) return console.error(err);
          console.log("saved:" + output.data[x]["symbolName"])
      });

    }

  })
  .catch(error => { 

    console.log(error);

        today = String(today.getDate()).padStart(2, '0') + '/' + //dd
                String(today.getMonth() + 1).padStart(2, '0') + '/' + //mm
                today.getFullYear(); //yyyy

        optionsDebugModel = db2.model('options_debug', optionsDebugSchema);

        optionsDebugModel.create({
            name: 'Options_Put',
            dateOfIssue: today,
            error: error.toString()
        });


  });


  setTimeout(function () {
    process.exit();
  }, 180 * 1000);

  });
});