const axios = require('axios')

function fetchSales() 
{
    axios.get('https://bandcamp.com/api/salesfeed/1/get?start_date=1566350340')
    .then(res => console.log(res.data["events"][0]["items"][0]["url"]) )
    .catch(err => "error")
}

fetchSales();

module.exports = fetchSales;

//getting the data

//1
//get initial - https://bandcamp.com/api/salesfeed/1/get_initial
//parse the results
//wait 120 seconds


//2
//get next batch -https://bandcamp.com/api/salesfeed/1/get?start_date=(end date from get_initial + 60)
//parse the results
//wait 120 seconds

//tracking the sales numbers

