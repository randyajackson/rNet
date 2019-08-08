const axios = require('axios');

const url = 'https://www.rottentomatoes.com/api/private/v2.0/browse?type="opening"';

var title;
var releaseDate;
var rating;
var synopsis;
var posters;

axios.get(url)
.then(response => {
    console.log(  response.data["counts"]["total"] );
    for(var i = 0; i < response.data["counts"]["total"]; i++)
    {
        title = response.data["results"][i]["title"];
    } 
    console.log(title);
})
.catch(error => {
    console.log(error);
})

