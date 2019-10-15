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

var interval; //used to give setInterval a name to use clearInterval(interval) if data breaks

const axios = require('axios');
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

var db2 =  mongoose.createConnection('mongodb://localhost/bandcampDebug', {useNewUrlParser: true});
var today = new Date();
var bandcampDebugModel;
var bandcampDebugSchema = mongoose.Schema({
    name: String,
    dateOfIssue: String,
    error: String
},
{timestamps: { createdAt: 'created_at'}});

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

    interval = setInterval( async function (){
        
        console.log(time);

        try{
        time = await getNext(time["endDate"], time["serverTime"]); 
        }
        catch(error){
            today = String(today.getDate()).padStart(2, '0') + '/' + //dd
            String(today.getMonth() + 1).padStart(2, '0') + '/' + //mm
            today.getFullYear(); //yyyy

            bandcampDebugModel = db2.model('bandcamp_debug', bandcampDebugSchema);

            bandcampDebugModel.create({
                name: 'Bandcamp',
                dateOfIssue: today,
                error: error.toString()
            });

            console.log("error", error);

            clearInterval(interval);
            setTimeout(function(){ beginCollection(); }, 600000);
        }

    }, 60000);
    
}

async function getInitial() 
{
    
        const response = await axios.get('https://bandcamp.com/api/salesfeed/1/get_initial');
    
    
        let findCount;
        albumModel = mongoose.model('bandcamp', albumSchema);

        for(let i = 0; i < response.data["feed_data"]["events"].length; i++)
        {
            for(let j = 0; j < response.data["feed_data"]["events"][i]["items"].length; j++) 
            {
                findCount = await albumModel.collection.countDocuments({
                     url : response.data["feed_data"]["events"][i]["items"][j]["url"] });
                //works as if a hash set using countDocuments - if not found add, else add to count
                if (findCount === 0)
                {
                    albumModel.create({
                        url: response.data["feed_data"]["events"][i]["items"][j]["url"],
                        album_title: response.data["feed_data"]["events"][i]["items"][j]["album_title"],
                        item_description: response.data["feed_data"]["events"][i]["items"][j]["item_description"],
                        art_url: response.data["feed_data"]["events"][i]["items"][j]["art_url"],
                        artist_name: response.data["feed_data"]["events"][i]["items"][j]["artist_name"],
                        count: 1
                    }, 
                    function (err, upcoming) {
                    if(err) return console.error(err);
                    });
                }
                else
                {
                    albumModel.updateOne(
                        { url : response.data["feed_data"]["events"][i]["items"][j]["url"] },
                        { $inc: {count : 1 } }, 
                    function (err, upcoming) {
                    if(err) return console.error(err);
                    });
                }

            
        }
    }

        console.log("*****first batch read*****");
        
        return {
            serverTime : response.data["feed_data"]["server_time"], 
            endDate : response.data["feed_data"]["end_date"]
        };
    
}

async function getNext(endDate, serverTime)
{
    
        const response = await axios.get('https://bandcamp.com/api/salesfeed/1/get?start_date=' + endDate);
      

        console.log(endDate + "!==" + response.data["end_date"] );

        if( endDate !== response.data["end_date"] )
        {
            let findCount;

            albumModel = mongoose.model('bandcamp', albumSchema);

        
            for(let i = 0; i < response.data["events"].length; i++)
            {
                for(let j = 0; j < response.data["events"][i]["items"].length; j++) 
                {
                    findCount = await albumModel.collection.countDocuments({
                        url : response.data["events"][i]["items"][j]["url"] });
                    
                    if (findCount === 0)
                    {
                        albumModel.create({
                            url: response.data["events"][i]["items"][j]["url"],
                            album_title: response.data["events"][i]["items"][j]["album_title"],
                            item_description: response.data["events"][i]["items"][j]["item_description"],
                            art_url: response.data["events"][i]["items"][j]["art_url"],
                            artist_name: response.data["events"][i]["items"][j]["artist_name"],
                            count: 1
                        }, 
                        function (err) {
                        if(err) return console.error(err);
                        });
                    }
                    else
                    {
                        albumModel.updateOne(
                            { url : response.data["events"][i]["items"][j]["url"] },
                            { $inc: {count : 1 } }, 
                        function (err) {
                        if(err) return console.error(err);
                        });
                    }
                }
            }
        
            console.log("*****next batch read*****");

            return {serverTime : response.data["server_time"], 
                    endDate : response.data["end_date"]};
        }
        else
        {
            console.log("*****duplicate end_date*****");

            return {serverTime : serverTime, 
                    endDate : endDate};    
        } 
}


module.exports = getInitial;



