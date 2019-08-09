const sort = require('js-flock/sort');
const axios = require('axios');
const mongoose = require('mongoose');

const allURL = "http://api.steampowered.com/ISteamApps/GetAppList/v2/";
const singleURL = "https://store.steampowered.com/api/appdetails?appids=";

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



axios.get(allURL)
    .then(response => {
        for(var i = 0; i < response.data["applist"]["apps"].length; i++)
        {
            console.log("in loop one");
            appid = response.data["applist"]["apps"][i]["appid"];

            queryURL = singleURL + appid;
            
            axios.get(queryURL)
            .then(response2 => {
                //if(response2.data[appid]["success"] === true)
                    console.log(response2.data[appid]["success"]);
            })

        }
    })