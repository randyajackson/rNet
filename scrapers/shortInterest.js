const axios = require('axios');
const mongoose = require('mongoose');

// var albumModel;
// var albumSchema = mongoose.Schema({
//     symbol: String,
//     name: String,
//     price: String,
//     change_1d: String,
//     change_ytd: String,
//     short_interest: Number
// });

// var db2 =  mongoose.createConnection('mongodb://localhost/bandcampDebug', {useNewUrlParser: true});
// var today = new Date();
// var bandcampDebugModel;
// var bandcampDebugSchema = mongoose.Schema({
//     name: String,
//     dateOfIssue: String,
//     error: String
// },
// {timestamps: { createdAt: 'created_at'}});

// console.log("opening db");

var fetch = require('node-fetch');

fetch("https://www.barchart.com/proxies/core-api/v1/quotes/get?list=options.mostActive.us&fields=symbol%2CsymbolType%2CsymbolName%2ChasOptions%2ClastPrice%2CpriceChange%2CpercentChange%2CoptionsImpliedVolatilityRank1y%2CoptionsTotalVolume%2CoptionsPutVolumePercent%2CoptionsCallVolumePercent%2CoptionsPutCallVolumeRatio%2CtradeTime%2CsymbolCode&orderBy=optionsCallVolumePercent&orderDir=desc&between(lastPrice%2C.10%2C)=&between(tradeTime%2C2021-07-06%2C2021-07-07)=&meta=field.shortName%2Cfield.type%2Cfield.description&hasOptions=true&page=1&limit=10&raw=1", {
  "headers": {
    "accept": "application/json",
    "accept-language": "en-US,en;q=0.9",
    "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-xsrf-token": "eyJpdiI6IkRQam5Fekk5OU41RVZkQkVTUVlTRWc9PSIsInZhbHVlIjoiVmI4TVF3ZGw0L0VRRThLaU8wSStFUHc0ZXY3andTb2VFNUhFTExCeGdSTFBxTEIzV25JSlhYc0lhdTc5YXZvbCIsIm1hYyI6ImE2YjY2NWI0NDhjOGFjMWU2ZjE3MDI3ZTQxOTZmNzNhNjUyZTU4ZjM3ZTQ3ZTc4NmIzZjZkOGQ3Yjg0YTNhNmQifQ==",
    "cookie": "market=eyJpdiI6ImFyUTlKSk1uNjNPcUNnTEpBdHRKRHc9PSIsInZhbHVlIjoidHl1Vmk1SFM5cDJzVkJOT09ISHRyQT09IiwibWFjIjoiOTQ2NTlmZDAyYTcxODExNGY5Y2NjMjI4YTAzYTBhY2Y5NDg0Y2Y0NGU2ZmZjYTAxYjExYWI0MjhlMjQ0M2YzOCJ9; bcFreeUserPageView=0; candles-07142021PageView=1; candles-07142021WebinarClosed=true; _gcl_au=1.1.1370323724.1625621218; usprivacy=1---; _ga=GA1.2.1158816038.1625621219; _gid=GA1.2.483804253.1625621219; __aaxsc=1; _admrla=2.2-62ee74440ce650ab-6cf10fe8-dec2-11eb-8856-cd07be91fbf3; __qca=P0-689732296-1625621221371; IC_ViewCounter_www.barchart.com=10; aasd=3%7C1625623022427; _awl=2.1625623023.0.4-14dc88d-9dddd5e6e40bc28c898a7ad1e56e4f52-6763652d75732d63656e7472616c31-60e509ef-1; laravel_token=eyJpdiI6IkZRZUJMZU1jd1UzL1kwR3lrSFhHY1E9PSIsInZhbHVlIjoiU2RLWTVGSWQxMDgzbWxBb01uRVcxeGVLQnZhVml0R2FDYisxRm5qTlBDR3owYTFYUmVjdWV1WE9xY2NnOXNkeGZ0OWtPK0MzVWQrMTBqTWVXK3I3Nkd1SENTZVhqRVo3THJzd0dsNi9DY1VIWUV6MWRyWTA0TUdFRWhUL1k1aDZCUEVBeEZlRlo2MG4vYVBoVzZzZUphSmdkWjdmUm9UM3JHRWoydzhSU05mUVpEamNZMWhIQmc2cTIybEdzVGVCU1l4dkIzYU1XamRsbVR0Wnl0UEQ3VU5iWVhabzRaS3hGdnpleWZWdXVGN21MdGxnekJTbmxsUGlINnVoR3JteSIsIm1hYyI6ImM1MDExOWI0MmNlOWNiYTU2MWNhYzNjODNjZDU0Y2RmMjhjZWY5NzFhYjcwMDYwMmI4MzkxYzE0NjJhYzI5MDUifQ%3D%3D; XSRF-TOKEN=eyJpdiI6IkRQam5Fekk5OU41RVZkQkVTUVlTRWc9PSIsInZhbHVlIjoiVmI4TVF3ZGw0L0VRRThLaU8wSStFUHc0ZXY3andTb2VFNUhFTExCeGdSTFBxTEIzV25JSlhYc0lhdTc5YXZvbCIsIm1hYyI6ImE2YjY2NWI0NDhjOGFjMWU2ZjE3MDI3ZTQxOTZmNzNhNjUyZTU4ZjM3ZTQ3ZTc4NmIzZjZkOGQ3Yjg0YTNhNmQifQ%3D%3D; laravel_session=eyJpdiI6IkZWZHdSdWx4bnZpdTcySjFwV0pzUWc9PSIsInZhbHVlIjoiaEdQaXVqWDRONDBGbWFyUmx0Y0VlZVlQQVNlZHVOWVNzU1ZlaEpQNWZDYTFLem1FQTQyYm4yQWtDVllwOHBsWCIsIm1hYyI6IjcyYTMxYzFjMGQ5MzUxMGFmYjVmZjY2NzFhYzRlNGFkMmZhNDA0NWVlYzliMGExNzFkZTExMTQyNzQyOWFkMTEifQ%3D%3D; _gat_UA-2009749-51=1"
  },
  "referrer": "https://www.barchart.com/options/most-active/stocks",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": null,
  "method": "GET",
  "mode": "cors"
}).then(res => res.json())
.then(json => console.log(json));

fetch("https://www.barchart.com/proxies/core-api/v1/quotes/get?list=options.mostActive.us&fields=symbol%2CsymbolType%2CsymbolName%2ChasOptions%2ClastPrice%2CpriceChange%2CpercentChange%2CoptionsImpliedVolatilityRank1y%2CoptionsTotalVolume%2CoptionsPutVolumePercent%2CoptionsCallVolumePercent%2CoptionsPutCallVolumeRatio%2CtradeTime%2CsymbolCode&orderBy=optionsPutVolumePercent&orderDir=desc&between(lastPrice%2C.10%2C)=&between(tradeTime%2C2021-07-06%2C2021-07-07)=&meta=field.shortName%2Cfield.type%2Cfield.description&hasOptions=true&page=1&limit=10&raw=1", {
  "headers": {
    "accept": "application/json",
    "accept-language": "en-US,en;q=0.9",
    "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-xsrf-token": "eyJpdiI6IkRQam5Fekk5OU41RVZkQkVTUVlTRWc9PSIsInZhbHVlIjoiVmI4TVF3ZGw0L0VRRThLaU8wSStFUHc0ZXY3andTb2VFNUhFTExCeGdSTFBxTEIzV25JSlhYc0lhdTc5YXZvbCIsIm1hYyI6ImE2YjY2NWI0NDhjOGFjMWU2ZjE3MDI3ZTQxOTZmNzNhNjUyZTU4ZjM3ZTQ3ZTc4NmIzZjZkOGQ3Yjg0YTNhNmQifQ==",
    "cookie": "market=eyJpdiI6ImFyUTlKSk1uNjNPcUNnTEpBdHRKRHc9PSIsInZhbHVlIjoidHl1Vmk1SFM5cDJzVkJOT09ISHRyQT09IiwibWFjIjoiOTQ2NTlmZDAyYTcxODExNGY5Y2NjMjI4YTAzYTBhY2Y5NDg0Y2Y0NGU2ZmZjYTAxYjExYWI0MjhlMjQ0M2YzOCJ9; bcFreeUserPageView=0; candles-07142021PageView=1; candles-07142021WebinarClosed=true; _gcl_au=1.1.1370323724.1625621218; usprivacy=1---; _ga=GA1.2.1158816038.1625621219; _gid=GA1.2.483804253.1625621219; __aaxsc=1; _admrla=2.2-62ee74440ce650ab-6cf10fe8-dec2-11eb-8856-cd07be91fbf3; __qca=P0-689732296-1625621221371; IC_ViewCounter_www.barchart.com=10; aasd=3%7C1625623022427; _awl=2.1625623023.0.4-14dc88d-9dddd5e6e40bc28c898a7ad1e56e4f52-6763652d75732d63656e7472616c31-60e509ef-1; laravel_token=eyJpdiI6IkZRZUJMZU1jd1UzL1kwR3lrSFhHY1E9PSIsInZhbHVlIjoiU2RLWTVGSWQxMDgzbWxBb01uRVcxeGVLQnZhVml0R2FDYisxRm5qTlBDR3owYTFYUmVjdWV1WE9xY2NnOXNkeGZ0OWtPK0MzVWQrMTBqTWVXK3I3Nkd1SENTZVhqRVo3THJzd0dsNi9DY1VIWUV6MWRyWTA0TUdFRWhUL1k1aDZCUEVBeEZlRlo2MG4vYVBoVzZzZUphSmdkWjdmUm9UM3JHRWoydzhSU05mUVpEamNZMWhIQmc2cTIybEdzVGVCU1l4dkIzYU1XamRsbVR0Wnl0UEQ3VU5iWVhabzRaS3hGdnpleWZWdXVGN21MdGxnekJTbmxsUGlINnVoR3JteSIsIm1hYyI6ImM1MDExOWI0MmNlOWNiYTU2MWNhYzNjODNjZDU0Y2RmMjhjZWY5NzFhYjcwMDYwMmI4MzkxYzE0NjJhYzI5MDUifQ%3D%3D; XSRF-TOKEN=eyJpdiI6IkRQam5Fekk5OU41RVZkQkVTUVlTRWc9PSIsInZhbHVlIjoiVmI4TVF3ZGw0L0VRRThLaU8wSStFUHc0ZXY3andTb2VFNUhFTExCeGdSTFBxTEIzV25JSlhYc0lhdTc5YXZvbCIsIm1hYyI6ImE2YjY2NWI0NDhjOGFjMWU2ZjE3MDI3ZTQxOTZmNzNhNjUyZTU4ZjM3ZTQ3ZTc4NmIzZjZkOGQ3Yjg0YTNhNmQifQ%3D%3D; laravel_session=eyJpdiI6IkZWZHdSdWx4bnZpdTcySjFwV0pzUWc9PSIsInZhbHVlIjoiaEdQaXVqWDRONDBGbWFyUmx0Y0VlZVlQQVNlZHVOWVNzU1ZlaEpQNWZDYTFLem1FQTQyYm4yQWtDVllwOHBsWCIsIm1hYyI6IjcyYTMxYzFjMGQ5MzUxMGFmYjVmZjY2NzFhYzRlNGFkMmZhNDA0NWVlYzliMGExNzFkZTExMTQyNzQyOWFkMTEifQ%3D%3D; _gat_UA-2009749-51=1"
  },
  "referrer": "https://www.barchart.com/options/most-active/stocks",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": null,
  "method": "GET",
  "mode": "cors"
}).then(res => res.json())
.then(json => console.log(json));
