require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');

const allURL = process.env.getMasterList;
const singleURL = process.env.getSingleList;

//used in getIDArray
var fullList = []; 
var idsToQuery = [];
var appid;

//used in narrowArray
var descriptionArray = [];
var queryResult = {};

//used in processQuery
var queryURL;

//used for set building / checking
var isSetBuilt = false;
var appListSet;
var displayDesc = [];

//variables for mongodb
var db;

var upcomingSchema = mongoose.Schema({
    id: String,
    name: String,
    releaseDate: String,
    short_description: String,
    header_image: String,
    price: String,
    genres: Array
});

var upcomingModel;
var upcomingSteam;
var count;
var deletingEntries = [];
var testArray = [];

var insertDictionary = {};
var insertArray = [];


var i = 0;

console.log("opening db");
mongoose.connect('mongodb://localhost/new_on_steam', {useNewUrlParser: true});
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));

db.once('open', function() {
dataCollect();
});

//---

async function dataCollect() {

    let allResponse = await axios.get(allURL).catch(err => console.log(err));

    let allIDs = await getIDArray(allResponse); 

    console.log("isSetBuilt " + isSetBuilt);

    console.log(appListSet.values());

    let detailQuery = await allIDs.map(x => processQuery(x))
    
    Promise.all(detailQuery)

    .then( async(x)  => {
        displayDesc = await narrowArray(x, allIDs);

        if(displayDesc.length > 0)
            testArray.push(displayDesc);

        console.log("test array: " + testArray);

        if(displayDesc.length > 0)
        {
            upcomingModel = mongoose.model('upcoming_steam', upcomingSchema);
            
            // count = upcomingModel.count({});

            // if(count > 20)
            // {
            //     count = count - 20;
                
            //     deletingEntries = upcomingModel.find()
            //                                     .sort({_id: 1})
            //                                     .limit(count)
            //                                     .toArray()
            //                                     .map(function(doc) { return doc._id; }); 

            //     upcomingModel.remove({_id: {$in: deletingEntries}})
            // }

            for(i = 0; i < displayDesc.length; i++ )
            {
                insertDictionary = {};
                insertDictionary["id"] = displayDesc[i]["id"];
                insertDictionary["name"] = displayDesc[i]["name"];
                insertDictionary["releaseDate"] = displayDesc[i]["release_date"];
                insertDictionary["short_description"] = displayDesc[i]["short_description"];
                insertDictionary["header_image"] = displayDesc[i]["header_image"];
                insertDictionary["price"] = displayDesc[i]["price"];
                insertDictionary["genres"] = displayDesc[i]["genres"];
                
                insertArray.push(insertDictionary);
            }
            
            upcomingModel.collection.insertMany(insertArray, function (err, upcoming) {
                if(err) return console.error(err);
                console.log("saved multiple");
            });
            
            displayDesc = [];
            insertArray = [];
        }
        else
        {
            console.log("not opening db");
        }


    } )
    .catch( error => { console.log(error) });
    //maybe try setInterval here
    setTimeout( function (){
        dataCollect(); console.log("in setTimeout");
    }, getRandomInt(1,10) * 60 * 1000);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

function getIDArray(result){

    idsToQuery = [];

    if( isSetBuilt === false)
    {
        for(i = 0; i < result.data["applist"]["apps"].length; i++)
        {
            appid = result.data["applist"]["apps"][i]["appid"];
            fullList.push(appid);
        } 

        appListSet = new Set(fullList);

        isSetBuilt = true;
    }
    else
    {
        for(i = 0; i < result.data["applist"]["apps"].length; i++)
        {
            appid = result.data["applist"]["apps"][i]["appid"];

            if( !appListSet.has(appid) )
            {
                idsToQuery.push(appid);
                appListSet.add(appid)    
            }
        }         
    }

    console.log("appListSet : " + appListSet.values())
    console.log("ids to query: " + idsToQuery);
    return idsToQuery;
}

async function processQuery(id){

    queryURL = singleURL + id;

    let promise = axios.get(queryURL);

    return promise;
}

async function narrowArray(records, ids){

    for(i = 0; i < records.length; i++)
    {   
        if(records[i].data[ ids[i] ]["success"] === true)
        {
            if(records[i].data[ ids[i] ]["data"]["type"] === "game" ||
               records[i].data[ ids[i] ]["data"]["type"] === "dlc")
            {
                queryResult["id"] =  ids[i] ;
                queryResult["name"] = records[i].data[ ids[i] ]["data"]["name"];
                queryResult["release_date"] = records[i].data[ ids[i] ]["data"]["release_date"]["date"];
                queryResult["short_description"] = records[i].data[ ids[i] ]["data"]["short_description"];
                queryResult["header_image"] = records[i].data[ ids[i] ]["data"]["header_image"];

                if(records[i].data[ ids[i] ]["data"]["is_free"] === true)
                    queryResult["price"] = "Free";
                else
                {
                    if( typeof records[i].data[ ids[i] ]["data"]["price_overview"] !== "undefined"
                        &&
                        typeof records[i].data[ ids[i] ]["data"]["price_overview"]["final_formatted"] !== "undefined")

                        queryResult["price"] = records[i].data[ ids[i] ]["data"]["price_overview"]["final_formatted"];
                    else
                        queryResult["price"] = "Price not set";
                }


                queryResult["genres"] = records[i].data[ ids[i] ]["data"]["genres"];

                descriptionArray.push(queryResult);

                queryResult = {};
            }
        }
    }   

    return descriptionArray;
      
}



