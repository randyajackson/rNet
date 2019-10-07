const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

var upcoming_sneaker;


mongoose.connect('mongodb://localhost/upcoming_sneakers', {useNewUrlParser: true});

var db2 =  mongoose.createConnection('mongodb://localhost/upcoming_sneakers_debug', {useNewUrlParser: true});
var today = new Date();
var sneakersDebugModel;
var sneakersDebugSchema = mongoose.Schema({
    name: String,
    dateOfIssue: String,
    error: String
},
{timestamps: { createdAt: 'created_at'}});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));

db.once('open', function() {

    db.dropCollection('newsneakers', function(err, result){
        if(err) return console.error(err);
        console.log("dropped collection");    
    });

    var upcomingSchema = mongoose.Schema({
        title: String,
        style: String,
        thumbnail: String,
        day: String,
        month: String
    });

    var upcomingModel = mongoose.model('newSneakers', upcomingSchema);


    const url = 'https://www.kixify.com/release-dates/upcoming?page=1';

    axios.get(url)
    .then(response => {
        var dates = [];

        const $ = cheerio.load(response.data)

        //adding release month and day to dictionary
        $('.event-date','.release-date-item-continer')
        .each(function(i, elem) {
            dates.push(processText($(this).text()));
        }); 
        
        //adding image thumbnail url to dictionary
        $('.img-responsive', '.thumbnail')
        .each(function(i, elem) {
            dates[i].thumbnail = $(this).attr("src") ;
        });

        //adding title of shoe
        $('.release-date-title')
        .each(function(i, elem) {
            dates[i].title = $(this).text() ;
        });

        //adding style of shoe
        $('.release-date-style')
        .each(function(i, elem) {
            dates[i].style = $(this).text() ;
        });

        for(var i = 0; i < dates.length; i++)
        {
            upcoming_sneaker = new upcomingModel({
                title: dates[i].title,
                style: dates[i].style,
                thumbnail: dates[i].thumbnail,
                day: dates[i].day,
                month: dates[i].month   
            });

            upcoming_sneaker.save(function (err, upcoming) {
                if(err) return console.error(err);
                console.log("saved:" + upcoming.title );
            });
        }

        setTimeout(function () {
            process.exit();
        }, 300 * 1000);
                
    })
    .catch(error => {
        console.log(error);

        today = String(today.getDate()).padStart(2, '0') + '/' + //dd
                String(today.getMonth() + 1).padStart(2, '0') + '/' + //mm
                today.getFullYear(); //yyyy

        sneakersDebugModel = db2.model('sneakers_debug', sneakersDebugSchema);

        sneakersDebugModel.create({
            name: 'New Sneakers',
            dateOfIssue: today,
            error: error.toString()
        });
    })
    
});

    

    function processText(inputText) {
        var output = [];
        var json = inputText.trim().split(' ');

        json.forEach(function (item) {
            output.push(item.replace(/'/g, '').split(/(\d+)/).filter(Boolean));
        });
        console.log(output[0][0] + " " + output[0][1]);
        var monthName;

        //switch case for month names
        switch(output[0][1]){
            case "Jan": 
            monthName = "January";
            break;

            case "Feb": 
            monthName = "February";
            break;

            case "Mar": 
            monthName = "March";
            break;

            case "Apr": 
            monthName = "April";
            break;

            case "May": 
            monthName = "May";
            break;

            case "Jun": 
            monthName = "June";
            break;

            case "Jul": 
            monthName = "July";
            break;

            case "Aug": 
            monthName = "August";
            break;

            case "Sep": 
            monthName = "September";
            break;

            case "Oct": 
            monthName = "October";
            break;

            case "Nov": 
            monthName = "November";
            break;

            case "Dec": 
            monthName = "December";
            break;

            default:
            monthName = output[0][1];
        }

        var returnVariables = {'day' : output[0][0], 'month' : monthName};

        return returnVariables;
    }


