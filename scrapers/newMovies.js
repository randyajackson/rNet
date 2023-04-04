require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');

const queryURL = process.env.newMoviesURL;
const currentDate = new Date().toISOString().slice(0, 10);
const url = `${queryURL}&region=US&language=en-US&release_date.gte=${currentDate}`;

var title;
var releaseDate;
var rating;
var synopsis;
var poster;

var upcomingMovie;

mongoose.connect('mongodb://localhost/upcoming_movies', {useNewUrlParser: true});

var db2 =  mongoose.createConnection('mongodb://localhost/upcoming_movies_debug', {useNewUrlParser: true});
var today = new Date();
var newMoviesDebugModel;
var newMoviesDebugSchema = mongoose.Schema({
    name: String,
    dateOfIssue: String,
    error: String
},
{timestamps: { createdAt: 'created_at'}});

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
        const responses = response.data["results"];
        for(var i = 0; i < responses.length; i++)
        {
            title = responses[i]["title"];
            releaseDate = responses[i]["release_date"];
            rating = (responses[i]["vote_average"] === 0) ? "-" : responses[i]["vote_average"];
            synopsis = responses[i]["overview"];
            poster = "https://image.tmdb.org/t/p/w500" + responses[i]["poster_path"];
            
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

        today = String(today.getDate()).padStart(2, '0') + '/' + //dd
                String(today.getMonth() + 1).padStart(2, '0') + '/' + //mm
                today.getFullYear(); //yyyy

        newMoviesDebugModel = db2.model('upcoming_movies_debug', newMoviesDebugSchema);

        newMoviesDebugModel.create({
            name: 'New Movies',
            dateOfIssue: today,
            error: error.toString()
        });

    })

    setTimeout(function () {
        process.exit();
    }, 180 * 1000);
});




