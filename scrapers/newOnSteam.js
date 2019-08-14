const sort = require('js-flock/sort');
const axios = require('axios');
const mongoose = require('mongoose');
const jq = require('node-jq');


const allURL = "http://api.steampowered.com/ISteamApps/GetAppList/v2/";
const singleURL = "https://store.steampowered.com/api/appdetails?appids=";

var fullList = [];
var detailList = [];
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

function dataCollect(){

    axios.get(allURL)
    .then( result => getIDArray(result) )
    .then( result => { getDetails(result) })
    .then( result => console.log(result) )
    .catch( error => { console.log(error) });

}

function getIDArray(result){

    for(var i = 0; i < result.data["applist"]["apps"].length; i++)
    {
        appid = result.data["applist"]["apps"][i]["appid"];
        fullList.push(appid);
    } 

    console.log(fullList);

    return fullList;
}

 function getDetails(idArray){
    console.log(idArray.length);
    
    let fullDescPromises = [];

    for(var i = 0; i < idArray.length; i++)
    {
        promise = processQuery(idArray[i]); 
        fullDescPromises.push( promise );
    } 

    return Promise.all(fullDescPromises);
    
}

 function processQuery(id){

    queryURL = singleURL + id;


    axios.get(queryURL)
        .then(fullDetailQuery => {

            // if(fullDetailQuery.data[id]["success"] === true
            // && fullDetailQuery.data[id]["data"]["type"] === "game"
            // && fullDetailQuery.data[id]["data"]["release_date"]["coming_soon"] === false )

            //     queryResult["id"] = id;
            //     queryResult["name"] = fullDetailQuery.data[id]["data"]["name"];
            //     queryResult["release_date"] = fullDetailQuery.data[id]["data"]["release_date"]["date"];
            //     queryResult["short_description"] = fullDetailQuery.data[id]["data"]["short_description"];
            //     queryResult["header_image"] = fullDetailQuery.data[id]["data"]["header_image"];
            //     queryResult["price"] = fullDetailQuery.data[id]["data"]["price_overview"]["final_formatted"];
            //     queryResult["genres"] = fullDetailQuery.data[id]["data"]["genres"];
            return fullDetailQuery;
                //descriptionArray.push(fullDetailQuery.data);

                //descriptionArray.push(queryResult);

               //queryResult = {};

        })
        .catch( error => { console.log(error) });
        

    
}





