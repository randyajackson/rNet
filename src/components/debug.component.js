import React, { Component } from 'react';

import '../css/Top_Searches_Component.css';
import './../css/progress_bar.css';

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
        
    }

    componentWillUnmount() {
    }

    render() {   

        var allProps = this.state.search_results.map(
            (currentResult, index) =>  <TrendingSearches results = {currentResult} index = {index} />);
        
        return (
            <React.Fragment>
            
            </React.Fragment>
                        
        );
            
        }


    }
