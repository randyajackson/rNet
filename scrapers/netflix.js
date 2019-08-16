const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.thrillist.com/entertainment/nation/netflix-original-series-movies-tv-shows-coming-in-2019';

axios.get(url)
.then(response => {
    const $ = cheerio.load(response.data)
    console.log(  $('section[data-page-element-index="6"]')
                  .find('.body-text__content')
                  .text()  
                );
})
.catch(error => {
    console.log(error);
})

