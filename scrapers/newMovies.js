const axios = require('axios');
const mongoose = require('mongoose');

const url = 'https://www.rottentomatoes.com/api/private/v2.0/browse?type="opening"';

var title;
var releaseDate;
var rating;
var synopsis;
var poster;

var upcomingMovie;

mongoose.connect('mongodb://localhost/upcoming_movies', {useNewUrlParser: true});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));

db.once('open', function() {

    db.dropCollection('upcoming_movies', function(err, result){
        if(err) return console.error(err);
        console.log("dropped collection");    
    });

    var upcomingSchema = mongoose.Schema({
        title: String,
        releaseDate: String,
        rating: String,
        synopsis: String,
        poster: String
    });

    var upcomingModel = mongoose.model('upcoming_movie', upcomingSchema);
    
    axios.get(url)
    .then(response => {
        console.log(  response.data["counts"]["total"] );
        for(var i = 0; i < parseInt(response.data["counts"]["total"]); i++)
        {
            title = response.data["results"][i]["title"];
            releaseDate = response.data["results"][i]["theaterReleaseDate"];
            rating = response.data["results"][i]["mpaaRating"];
            synopsis = response.data["results"][i]["synopsis"];
            poster = response.data["results"][i]["posters"]["primary"];
            
            upcomingMovie = new upcomingModel({
                title: title,
                releaseDate: releaseDate,
                rating: rating,
                synopsis: synopsis,
                poster: poster    
            });

            upcomingMovie.save(function (err, upcoming) {
                if(err) return console.error(err);
                console.log("saved:" + upcoming.title)
            });
        } 

    })
    .catch(error => {
        console.log(error);
    })

    setTimeout(function () {
        process.exit();
    }, 20 * 1000);
});




