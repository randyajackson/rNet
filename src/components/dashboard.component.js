import React, { Component } from 'react';
import '../css/Dashboard_Component.css';
import { responsePathAsArray } from 'graphql';

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

const DebugProp = props => (
        <div>
            <span>{props.results.name}</span>
            <span> {props.results.dateOfIssue}</span>
            <span> {props.results.error}</span>
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

        var bandcampDebug = this.state.bandcamp_debug.map(
            (currentResult, index) =>  <DebugProp results = {currentResult} index = {index} />);
        
        var newMoviesDebug = this.state.new_movie_debug.map(
            (currentResult, index) =>  <DebugProp results = {currentResult} index = {index} />);
        
        var upcomingSneakersDebug = this.state.upcoming_sneakers_debug.map(
            (currentResult, index) =>  <DebugProp results = {currentResult} index = {index} />);
        
        var cryptoDebug = this.state.crypto_debug.map(
            (currentResult, index) =>  <DebugProp results = {currentResult} index = {index} />);

        var topSearchesDebug = this.state.top_searches_debug.map(
            (currentResult, index) =>  <DebugProp results = {currentResult} index = {index} />);

        return (
            <React.Fragment>
            {bandcampDebug}
            {newMoviesDebug}
            {upcomingSneakersDebug}
            {cryptoDebug}
            {topSearchesDebug}
            </React.Fragment>               
        );
            
        }


    }
