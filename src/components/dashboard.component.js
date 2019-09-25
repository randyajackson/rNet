import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../css/Dashboard_Component.css';

const mongoose = require('mongoose');

const requester = require('graphql-request');

function createQuery(dataName){

    return( 
    {
    graphqlQuery: "{" +
                        dataName +
                        "{" +
                            "name," +
                            "dateOfIssue," +
                            "error" +
                        "}" +
                   "}",
    name: dataName
    }

    );

}

function getTextAreaText(results){

    let text = "";

    if(results.length > 0)
    {
        for(let i = 0; i < results.length; i++)
        {
            text += results[i].dateOfIssue + ": " + results[i].error + "\n";
        }
    }

    return text;

}

function dropDatabase(dbName, dbCollection){

    console.log(dbName + " " + dbCollection);

    
    mongoose.connect('mongodb://localhost/upcoming_sneakers', {useNewUrlParser: true});
    var db = mongoose.connection;
    db.once('open', function() {
        db.dropCollection('newsneakers', function(err, result){
            if(err) return console.error(err);
            console.log("dropped collection");    
        });
    });
}

const DebugConsoleProp = props => (
        <div className = "single_debug_console">
            <div className = "header"><b>{props.header}</b></div>

            {(() => {
                if(props.errorText === "")
                    return(<div className = "status" id = "green" ><span role="img" aria-label="check">Status: ✔</span></div>);
                else
                    return(<div className = "status" id = "red"><span role="img" aria-label="x">Status: ❌</span></div>);
            })()}    

            <div className = "dropDB"><Link to="#" onClick={() => dropDatabase(props.dbName, props.collection)}>Clear</Link></div>

            <div className = "textArea">
                <textarea readOnly value = {props.errorText} cols = "70" rows = "5"  />
            </div>

        </div>
)

export default class DebugDashboard extends Component {

    constructor(props){
        super(props);

        this.state = { 
                        bandcamp_debug : [],
                        new_movie_debug : [],
                        upcoming_sneakers_debug : [],
                        crypto_debug : [],
                        top_searches_debug : []
                     };
    }

    componentDidMount(){
    
    setInterval( () => {

        //obtain the graphQL queries 
        let crypto = createQuery("crypto_debug"); 
        let bandcamp = createQuery("bandcamp_debug");  
        let newMovie = createQuery("new_movie_debug");  
        let topSearches = createQuery("top_searches_debug");  
        let upcomingSneakers = createQuery("upcoming_sneakers_debug"); 

        let queryStringArray = [crypto, bandcamp, newMovie, topSearches, upcomingSneakers];
        
        let queryPromises = [];

        //create promise array from queries
        queryStringArray.forEach(function(element) {
            queryPromises.push( requester.request('http://localhost:8000/graphql', element.graphqlQuery) );
        });

        //set state with promise array
        Promise.all(queryPromises).then( response => {

            for(let i = 0; i < response.length ; i++)
            {
                    this.setState({
                        [queryStringArray[i]["name"]] : response[i][queryStringArray[i]["name"]]
                    }); 
            }     
                
        });

    }, 5000);
       
    }

    componentWillUnmount(){
    }

    render() {
        
        var headerNames = ["Bandcamp", "New Movies", "New Sneakers", "Crypto", "Top Searches"];

        var dbNames = ["bandcampDebug", "upcoming_movies_debug", "upcoming_sneakers_debug", 
                       "cryptoDebug", "googleSearchesDebug"];

        var collectionNames = ["bandcamp_debugs", "upcoming_movies_debugs", "sneakers_debugs",
                               "crypto_debug", "top_searches_debug"];

        var bandcampDebugText = getTextAreaText(this.state.bandcamp_debug); 
        var bandcampDebugHeader = <DebugConsoleProp 
                                    header = {headerNames[0]} 
                                    errorText = {bandcampDebugText} 
                                    dbName = {dbNames[0]} 
                                    collection = {collectionNames[0]} /> ;
        
        var newMoviesDebugText = getTextAreaText(this.state.new_movie_debug);
        var newMoviesDebugHeader = <DebugConsoleProp 
                                    header = {headerNames[1]} 
                                    errorText = {newMoviesDebugText} 
                                    dbName = {dbNames[1]} 
                                    collection = {collectionNames[1]}/> ;
        
        var upcomingSneakersDebugText = getTextAreaText(this.state.upcoming_sneakers_debug);
        var upcomingSneakersDebugHeader = <DebugConsoleProp 
                                            header = {headerNames[2]} 
                                            errorText = {upcomingSneakersDebugText} 
                                            dbName = {dbNames[2]} 
                                            collection = {collectionNames[2]}/> ;

        var cryptoDebugText = getTextAreaText(this.state.crypto_debug);
        var cryptoDebugHeader = <DebugConsoleProp 
                                    header = {headerNames[3]} 
                                    errorText = {cryptoDebugText} 
                                    dbName = {dbNames[3]} 
                                    collection = {collectionNames[3]}/> ;

        var topSearchesDebugText = getTextAreaText(this.state.top_searches_debug);
        var topSearchesDebugHeader = <DebugConsoleProp 
                                        header = {headerNames[4]} 
                                        errorText = {topSearchesDebugText} 
                                        dbName = {dbNames[4]} 
                                        collection = {collectionNames[4]}/> ;


        return (
            <React.Fragment>

            <div className = "all_debug_consoles">
                {bandcampDebugHeader}
                {newMoviesDebugHeader}
                {upcomingSneakersDebugHeader}
                {cryptoDebugHeader}
                {topSearchesDebugHeader}
            </div>
            
            </React.Fragment>               
        );
            
        }


    }
