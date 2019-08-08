const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.rottentomatoes.com/api/private/v2.0/browse?type="opening"';

axios.get(url)
.then(response => {
    //const $ = cheerio.load(response.data)
    console.log(  response.data );
})
.catch(error => {
    console.log(error);
})

