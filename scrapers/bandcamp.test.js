const fetchSales = require('./bandcamp');
const axios = require('axios')
test('Check for return', () => {
    //expect.assertions(1);
    axios.get('https://bandcamp.com/api/salesfeed/1/get?start_date=1566350340')
    .then(data => {
        expect(data.events[0]["items"][0]["url"]).toEqual("//lovelornphilly.bandcamp.com/merch/lo");
    });
    
});