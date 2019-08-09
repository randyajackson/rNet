const sort = require('js-flock/sort');
const axios = require('axios');
const mongoose = require('mongoose');

const allURL = "http://api.steampowered.com/ISteamApps/GetAppList/v2/";
const singleURL = "https://store.steampowered.com/api/appdetails?appids=";

var fullList = [];
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
//--
var dataCollect = new Object();

dataCollect.getAll = function (){
    var promise = axios.get(allURL)
    .then(response => { return response; } )
    .catch(error => { console.log(error)});

    return promise;
}

dataCollect.getAll().then(function(result){
    for(var i = 0; i < result.data["applist"]["apps"].length; i++)
    {
        appid = result.data["applist"]["apps"][i]["appid"];
        fullList.push(appid);
    } 
    console.log(fullList);
});





