//getting the data
//1
//get initial - https://bandcamp.com/api/salesfeed/1/get_initial
//parse the results
//wait 120 seconds


//2
//get next batch -https://bandcamp.com/api/salesfeed/1/get?start_date=end date from previous
//parse the results
//wait 120 seconds

//tracking the sales numbers

//the key is the url
//using $inc in mongodb to increase counter

//if not found
//mongodb.get
//mongodb.put('//beattheredlight.bandcamp.com/album/beat-the-red-light', 
//             {count: count, artist_name: artist_name, art_url: art_url,
//              album name: item_description});


const axios = require('axios')
const mongoose = require('mongoose');

//global variables used for accessing and verifying
//= {serverTime: 0, endDate: 0}; //serverTime verifying, endDate accessing


beginCollection();

async function beginCollection()
{
    var time = await getInitial(); 

    console.log(time["serverTime"]);
    console.log(time["endDate"]);

    //time = await getNext(time["endDate"], time["serverTime"]);
}

async function getInitial() 
{
    try{
        const response = await axios.get('https://bandcamp.com/api/salesfeed/1/get_initial');

        return {serverTime : response.data["feed_data"]["server_time"], 
                endDate : response.data["feed_data"]["end_date"]};
    }
    catch(error){
        console.log("error", error);
    }
}

// async function getNext(endDate, serverTime)
// {
//     try{
//         const response = await axios.get('https://bandcamp.com/api/salesfeed/1/get?start_date=' + endDate);

//         return {serverTime : response.data["feed_data"]["server_time"], 
//                 endDate : response.data["feed_data"]["end_date"]};
//     }
//     catch(error){
//         console.log("error", error);
//     }    
// }


module.exports = getInitial;
//console.log(res.data["events"][0]["items"][0]["url"])



