const sort = require('js-flock/sort');
const axios = require('axios');
const mongoose = require('mongoose');
const jq = require('node-jq');
var throttledQueue = require('throttled-queue');

var throttle = throttledQueue(5, 1000); // at most 5 requests per second.

const allURL = "http://api.steampowered.com/ISteamApps/GetAppList/v2/";
const singleURL = "https://store.steampowered.com/api/appdetails?appids=";

var fullList = [];
var descriptionArray = [];
var queryResult = {};

//--
var appid;
var queryURL;

dataCollect();

//---

async function dataCollect() {

    let allResponse = await axios.get(allURL);
    let allIDs = await getIDArray(allResponse); 

    allIDs = allIDs.slice(0,10);

    let detailQuery = await allIDs.map(x => processQuery(x))
    
    Promise.all(detailQuery)
    .then( x => {
        var displayDesc = narrowArray(x, allIDs);
        console.log(displayDesc);
    } )
    .catch( error => { console.log(error) });

    
}

function getIDArray(result){

    for(var i = 0; i < result.data["applist"]["apps"].length; i++)
    {
        appid = result.data["applist"]["apps"][i]["appid"];
        fullList.push(appid);
    } 

    return fullList;
}

async function processQuery(id){

    queryURL = singleURL + id;

    let promise = axios.get(queryURL);

    return await promise;
}

async function narrowArray(records, ids){

    for(var i = 0; i < records.length; i++)
    {
        if(records[i].data[ ids[i] ]["success"] === true)
        {
            if(records[i].data[ ids[i] ]["data"]["type"] === "game"
            && records[i].data[ ids[i] ]["data"]["release_date"]["coming_soon"] === false)
            {
                queryResult["id"] =  ids[i] ;
                queryResult["name"] = records[i].data[ ids[i] ]["data"]["name"];
                queryResult["release_date"] = records[i].data[ ids[i] ]["data"]["release_date"]["date"];
                queryResult["short_description"] = records[i].data[ ids[i] ]["data"]["short_description"];
                queryResult["header_image"] = records[i].data[ ids[i] ]["data"]["header_image"];

                
                if(records[i].data[ ids[i] ]["data"]["is_free"] === true)
                    queryResult["price"] = "Free";
                else
                    queryResult["price"] = records[i].data[ ids[i] ]["data"]["price_overview"]["final_formatted"];


                queryResult["genres"] = records[i].data[ ids[i] ]["data"]["genres"];

                descriptionArray.push(queryResult);

                queryResult = {};
            }
        }
    }

    return descriptionArray;
      
}



