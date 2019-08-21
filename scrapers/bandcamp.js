const axios = require('axios')



function fetchSales() 
{
    axios.get('https://bandcamp.com/api/salesfeed/1/get?start_date=1566350340')
    .then(res => console.log(res.data["events"][0]["items"][0]["url"]) )
    .catch(err => "error")
}

fetchSales();



module.exports = fetchSales;