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
dataCollect();

function dataCollect(){
    axios.get(allURL)
    .then(result => getIDArray(result))
    .then(idArray => getDetails(idArray))
    .catch(error => { console.log(error)});
}

function getIDArray(result){
    for(var i = 0; i < result.data["applist"]["apps"].length; i++)
    {
        appid = result.data["applist"]["apps"][i]["appid"];
        fullList.push(appid);
    } 
    return fullList;
}

function getDetails(idArray){
    for(var i = 0; i < idArray.length; i++)
    {
        detailList = processQuery(idArray[i], detailList);    
    } 
    
    console.log(detailList);

    return detailList;
}

function processQuery(id, descriptionArray){
    axios.get(singleURL + id)
        .then(fullDetailQuery => {

            if(fullDetailQuery[id]["success"] == true
            && fullDetailQuery[id]["data"]["type"] == "game"
            && fullDetailQuery[id]["data"]["release_date"]["coming_soon"] == false)

                queryResult["id"] = id;
                queryResult["name"] = fullDetailQuery[id]["data"]["name"];
                queryResult["release_date"] = fullDetailQuery[id]["data"]["release_date"]["date"];
                queryResult["short_description"] = fullDetailQuery[id]["data"]["short_description"];
                queryResult["header_image"] = fullDetailQuery[id]["data"]["header_image"];
                queryResult["price"] = fullDetailQuery[id]["data"]["price_overview"]["final_formatted"];
                queryResult["genres"] = fullDetailQuery[id]["data"]["genres"];

                descriptionArray.push(queryResult);

                queryResult = {};
            
            return descriptionArray;

        })
        .catch(error => { console.log(error) });
}





