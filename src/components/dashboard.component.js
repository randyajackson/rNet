import React, { Component } from 'react';
import '../css/Dashboard_Component.css';

const requester = require('graphql-request');

function createQuery(dataName){

    return( 
    "{" +
        dataName +
        "{" +
            "name," +
            "dateOfIssue," +
            "error" +
        "}" +
    "}"
    );

}

const BandcampDebug = props => (
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
                        newMovies_debug : [],
                        sneakers_debug : [],
                        crypto_debug : [],
                        topSearches_debug : []
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
            
        //getPageData.call(this);
    }, 3000);
       
    }

    componentWillUnmount(){
    }

    render() {   

        var bandcamp = this.state.bandcamp_debug.map(
            (currentResult, index) =>  <BandcampDebug results = {currentResult} index = {index} />);
        
        //var newMovies = this.state.search_results.map(
            //(currentResult, index) =>  <TrendingSearches results = {currentResult} index = {index} />);
        
        //var sneakers = this.state.search_results.map(
            //(currentResult, index) =>  <TrendingSearches results = {currentResult} index = {index} />);
        
        //var crypto = this.state.search_results.map(
            //(currentResult, index) =>  <TrendingSearches results = {currentResult} index = {index} />);

        //var topSearches = this.state.search_results.map(
            //(currentResult, index) =>  <TrendingSearches results = {currentResult} index = {index} />);
        return (
            <React.Fragment>
            {bandcamp}
            </React.Fragment>               
        );
            
        }


    }
