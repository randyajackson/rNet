const mongoose = require('mongoose');

//the scripts in this scheduler drop their databases at different times
//used for scripts that update themselves but do not drop their dbs
var db; 

setInterval(function () {

    const bandcamp = mongoose.createConnection('mongodb://localhost/bc', {useNewUrlParser: true});
    const crypto = mongoose.createConnection('mongodb://localhost/crypto', {useNewUrlParser: true});
    let Schema = new mongoose.Schema({});

    Promise.all([bandcamp, crypto]).then(() => {
        let bc = bandcamp.model('bandcamps', Schema);
        let cto = crypto.model('crypto_data_prices', Schema);

        bc.collection.deleteMany({});
        console.log("dropped collection: " + Date.now()); 
        
        crypto.dropCollection('crypto_data_prices', function(err, result){
        if(err) return console.error(err);
        });
        
        console.log("dropped collection: " + Date.now()); 
    });





    // //drops the bandcamp database once every 24 hours
    // mongoose.connect('mongodb://localhost/bc', {useNewUrlParser: true});
    // db2 = mongoose.connection;
    // db2.on('error', console.error.bind(console, 'connection error: '));
    // db2.once('open', function() {
    //     db2.dropCollection('bandcamps', function(err, result){
    //         if(err) return console.error(err);
    //         console.log("dropped collection: " + Date.now());    
    //     });
    // });

    
    // //drops the crypto database once every 24 hours
    // mongoose.connect('mongodb://localhost/crypto', {useNewUrlParser: true});
    // db = mongoose.connection;
    // db.on('error', console.error.bind(console, 'connection error: '));
    // db.once('open', function() {
    //     db.dropCollection('crypto_data_prices', function(err, result){
    //         if(err) return console.error(err);
    //         console.log("dropped collection: " + Date.now());    
    //     });
    // });
// }, 100);
}, 1000 * 60 * 60 * 24);

    