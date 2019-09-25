import React, { Component } from 'react';
import '../css/Dashboard_Component.css';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

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

const DebugHeaderProp = props => (
        <div className = "single_debug_console">
            <div className = "header"> <b>{props.header}</b> </div>
            <div className = "status"> Status: dot </div>
            <div className = "dropDB"> X </div>
        </div>
)
// {props.results.name}
//             {props.results.dateOfIssue}
//             {props.results.error}


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

        var bandcampDebugHeader = <DebugHeaderProp header = {headerNames[0]} /> ;

        // var bandcampDebug = this.state.bandcamp_debug.map(
        //     (currentResult, header) =>  <DebugProp results = {currentResult} header = {headerNames[0]} />);
        
        var newMoviesDebugHeader = <DebugHeaderProp header = {headerNames[1]} /> ;

        // var newMoviesDebug = this.state.new_movie_debug.map(
        //     (currentResult, header) =>  <DebugProp results = {currentResult} header = {headerNames[1]} />);
        
        var upcomingSneakersDebugHeader = <DebugHeaderProp header = {headerNames[2]} /> ;

        // var upcomingSneakersDebug = this.state.upcoming_sneakers_debug.map(
        //     (currentResult, header) =>  <DebugProp results = {currentResult} header = {headerNames[2]} />);
        
        var cryptoDebugHeader = <DebugHeaderProp header = {headerNames[3]} /> ;

        // var cryptoDebug = this.state.crypto_debug.map(
        //     (currentResult, header) =>  <DebugProp results = {currentResult} header = {headerNames[3]} />);

        var topSearchesDebugHeader = <DebugHeaderProp header = {headerNames[4]} /> ;

        // var topSearchesDebug = this.state.top_searches_debug.map(
        //     (currentResult, header) =>  <DebugProp results = {currentResult} header = {headerNames[4]} />);

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
