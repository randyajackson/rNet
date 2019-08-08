const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.vulture.com/article/new-on-netflix-movies-shows-originals.html';

axios.get(url)
.then(response => {
    const $ = cheerio.load(response.data)
    console.log(  $('p[class=clay-paragraph]').find($('em')).text()  );
})
.catch(error => {
    console.log(error);
})

