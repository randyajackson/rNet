import React, { Component } from 'react';
import '../css/Top_Searches_Component.css';
import background from '../videos/test.mp4';

const requester = require('graphql-request');

const topSearchQuery = 
"{" +
    "top_searches" +
    "{" +
      "rank," +
      "topic" +
    "}" +
"}";

const TrendingSearches = props => (
        <div>
            <div class = "single_result_top_searches">
                <span id="rank">{props.results.rank}</span><span id="topic"> {props.results.topic}</span>
            </div>
        </div>
)

export default class TopSearchesResults extends Component {

    constructor(props){
        super(props);

        this.state = { 
                        search_results: []
                     };
    }

    componentDidMount()
    {
        setInterval( () => {

            requester.request('http://localhost:8000/graphql', topSearchQuery)
            .then(response => {
                this.setState({
                    search_results: response.top_searches
                })
            })
            .catch((error) => {
                console.log(error);
            })
        }, 5000)
        
    }

    render() {   

        var allProps = this.state.search_results.map(
            (currentResult, index) =>  <TrendingSearches results = {currentResult} index = {index} />);
        
        return (
            <React.Fragment>
                {/* <video muted loop autoPlay id="bgVideo">
                    <source src= {background} type="video/mp4" />
                </video> */}

                <div class = "all_results_top_searches">
                    {allProps}
                </div>
            </React.Fragment>
                        
        );
            
        }


    }
