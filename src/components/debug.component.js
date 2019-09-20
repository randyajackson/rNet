import React, { Component } from 'react';
import '../css/Dashboard_Component.css';

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost/";

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

    componentDidMount()
    {

        let getDebugData = function(db, collection, stateName) {
            let componentDidMountThis = this;
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db(db);
                dbo.collection(collection).find().toArray(function(err, result) {
                  
                  if (err) throw err;

                  componentDidMountThis.setState({
                    [stateName]: result
                    }).bind(this);

                  db.close();
                });
              });
        }

        getDebugData.call(this, "bandcampDebug",  "bandcamp_debug", "bandcamp_debug");
        
        setInterval( () => {

            getDebugData.call(this, "bandcampDebug",  "bandcamp_debug", "bandcamp_debug");

        }, 600000)
        
    }

    componentWillUnmount() {
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
