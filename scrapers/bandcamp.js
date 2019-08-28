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

//variables for mongodb
var db;
var albumModel;

var albumSchema = mongoose.Schema({
    url: String,
    art_url: String,
    album_title: String,
    artist_name: String,
    item_description: String,
    count: Number
});

console.log("opening db");

mongoose.connect('mongodb://localhost/bc', {useNewUrlParser: true});
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));

db.once('open', function() {
    beginCollection();
});

async function beginCollection()
{
    var time = await getInitial(); 

    console.log(time);

    //time = await getNext(time["endDate"], time["serverTime"]);
}

async function getInitial() 
{
    try{
        const response = await axios.get('https://bandcamp.com/api/salesfeed/1/get_initial');
        
        let findCount;
        albumModel = mongoose.model('bandcamp', albumSchema);

        for(let i = 0; i < response.data["feed_data"]["events"].length; i++)
        {
            for(let j = 0; j < response.data["feed_data"]["events"][i]["items"].length; j++) 
            {
                findCount = await albumModel.collection.countDocuments({
                     url : response.data["feed_data"]["events"][i]["items"][j]["url"] });
                
                if (findCount === 0)
                {
                    albumModel.create({
                        url: response.data["feed_data"]["events"][i]["items"][j]["url"],
                        album_title: response.data["feed_data"]["events"][i]["items"][j]["album_title"],
                        item_description: response.data["feed_data"]["events"][i]["items"][j]["item_description"],
                        art_url: response.data["feed_data"]["events"][i]["items"][j]["art_url"],
                        artist_name: response.data["feed_data"]["events"][i]["items"][j]["artist_name"]
                    }, 
                    function (err, upcoming) {
                    if(err) return console.error(err);
                    });
                }
                else
                {

                }

                // console.log(findCount);    
                // console.log(response.data["feed_data"]["events"][i]["items"][j]["album_title"]);
                // console.log(response.data["feed_data"]["events"][i]["items"][j]["item_description"]);
                // console.log(response.data["feed_data"]["events"][i]["items"][j]["url"]);
                // console.log(response.data["feed_data"]["events"][i]["items"][j]["art_url"]);
                // console.log(response.data["feed_data"]["events"][i]["items"][j]["artist_name"]);
            }
        }

        return {
            serverTime : response.data["feed_data"]["server_time"], 
            endDate : response.data["feed_data"]["end_date"]
        };
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



