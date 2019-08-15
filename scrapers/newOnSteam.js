const axios = require('axios');
const mongoose = require('mongoose');

const allURL = "http://api.steampowered.com/ISteamApps/GetAppList/v2/";
const singleURL = "https://store.steampowered.com/api/appdetails?appids=";

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

dataCollect();

//---


async function dataCollect() {

    let allResponse = await axios.get(allURL);
    let allIDs = await getIDArray(allResponse, isSetBuilt); 

    console.log("isSetBuilt " + isSetBuilt);

    console.log(appListSet.values());

    let detailQuery = await allIDs.map(x => processQuery(x))
    
    Promise.all(detailQuery)
    .then( x => {
        displayDesc = narrowArray(x, allIDs);
        console.log(displayDesc);
    } )
    .catch( error => { console.log(error) });

    setTimeout( function (){
        dataCollect(); console.log("in setTimeout");
    //}, 5* 60 * 1000);
    }, 45000);
}



function getIDArray(result){
    
    idsToQuery = [];

    if( isSetBuilt === false)
    {
        for(var i = 0; i < result.data["applist"]["apps"].length; i++)
        {
            appid = result.data["applist"]["apps"][i]["appid"];
            fullList.push(appid);
        } 

        appListSet = new Set(fullList);

        isSetBuilt = true;
    }
    else
    {
        for(var i = 0; i < result.data["applist"]["apps"].length; i++)
        {
            appid = result.data["applist"]["apps"][i]["appid"];

            if( !appListSet.has(appid) )
            {
                idsToQuery.push(appid);
                appListSet.add(appid)    
            }
        }         
    }

    console.log(appListSet.values())

    return idsToQuery;
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



