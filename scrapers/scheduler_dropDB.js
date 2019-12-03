const mongoose = require('mongoose');
const mongoose2 = require('mongoose');

//the scripts in this scheduler drop their databases at different times
//used for scripts that update themselves but do not drop their dbs
var db; 
var db2;

setInterval(function () {

    //drops the bandcamp database once every 24 hours
    mongoose2.connect('mongodb://localhost/bc', {useNewUrlParser: true});
    db2 = mongoose2.connection;
    db2.on('error', console.error.bind(console, 'connection error: '));
    db2.once('open', function() {
        db2.dropCollection('bandcamp', function(err, result){
            if(err) return console.error(err);
            console.log("dropped collection: " + Date.now());    
        });
    });

    
    //drops the crypto database once every 24 hours
    mongoose.connect('mongodb://localhost/crypto', {useNewUrlParser: true});
    db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error: '));
    db.once('open', function() {
        db.dropCollection('crypto_data_prices', function(err, result){
            if(err) return console.error(err);
            console.log("dropped collection: " + Date.now());    
        });
    });

}, 1000 * 60 * 60 * 24);

    