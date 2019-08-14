const sort = require('js-flock/sort');
const axios = require('axios');
const mongoose = require('mongoose');
const jq = require('node-jq');
var throttledQueue = require('throttled-queue');

var throttle = throttledQueue(5, 1000); // at most 5 requests per second.

const allURL = "http://api.steampowered.com/ISteamApps/GetAppList/v2/";
const singleURL = "https://store.steampowered.com/api/appdetails?appids=";

var fullList = [];
var detailList = [];
var descriptionArray = [];
var queryResult = {};

//--
var appid;
var queryURL;
//--
var success;
var type;
var coming_soon;
//--
var name;
var release_date;
var short_description;
var header_image;
var price;
var genres;
//--
var promise;

dataCollect();

//===

async function dataCollect() {

    let allResponse = await axios.get(allURL);
    let allIDs = await getIDArray(allResponse); 

    allIDs = allIDs.slice(0,10);

    let detailQuery = await allIDs.map(x => processQuery(x))
    
    Promise.all(detailQuery)
    //.then(x => console.log(x[9].data))
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
        //console.log(records[i].data[ ids[i] ]["success"], ids[i]);

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


//===
// function dataCollect(){

//     axios.get(allURL)
//     .then( result => getIDArray(result) )
//     .then( result => { getDetails(result) })
//     .then( result => console.log(result) )
//     .catch( error => { console.log(error) });

// }

// async function getIDArray(result){

//     for(var i = 0; i < result.data["applist"]["apps"].length; i++)
//     {
//         appid = result.data["applist"]["apps"][i]["appid"];
//         fullList.push(appid);
//     } 

//     return await fullList;
// }

//  async function getDetails(idArray){

//     console.log(idArray.length);
    
//     let fullDescPromises = [];

//     for(var i = 0; i < idArray.length; i++)
//     {
//         promise = await processQuery(idArray[i]); 
//         fullDescPromises.push( promise );
//     } 

//     return Promise.all(fullDescPromises);
    
// }

//  async function processQuery(id){

//     queryURL = singleURL + id;


//     axios.get(queryURL)
//         .then(fullDetailQuery => {

//             // if(fullDetailQuery.data[id]["success"] === true
//             // && fullDetailQuery.data[id]["data"]["type"] === "game"
//             // && fullDetailQuery.data[id]["data"]["release_date"]["coming_soon"] === false )

//             //     queryResult["id"] = id;
//             //     queryResult["name"] = fullDetailQuery.data[id]["data"]["name"];
//             //     queryResult["release_date"] = fullDetailQuery.data[id]["data"]["release_date"]["date"];
//             //     queryResult["short_description"] = fullDetailQuery.data[id]["data"]["short_description"];
//             //     queryResult["header_image"] = fullDetailQuery.data[id]["data"]["header_image"];
//             //     queryResult["price"] = fullDetailQuery.data[id]["data"]["price_overview"]["final_formatted"];
//             //     queryResult["genres"] = fullDetailQuery.data[id]["data"]["genres"];
//             return fullDetailQuery;
//                 //descriptionArray.push(fullDetailQuery.data);

//                 //descriptionArray.push(queryResult);

//                //queryResult = {};

//         })
//         .catch( error => { console.log(error) });
        

    
// }





