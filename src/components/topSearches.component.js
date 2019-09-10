import React, { Component } from 'react';
import '../css/Top_Searches_Component.css';

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
        
        // this.myRef = React.createRef();

        this.state = { 
                        search_results: []
                     };
    }

    componentDidMount()
    {   
        // this.effect = window.VANTA.FOG({
        //     el: this.myRef.current,
        //     highlightColor: 0xfff3f3,
        //     midtoneColor: 0x8fbdff,
        //     lowlightColor: 0xc088bd,
        //     baseColor: 0xffffff,
        //     blurFactor: 0.47,
        //     speed: 0.10,
        //     zoom: 1.10
        //     });

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

    componentWillUnmount() {
        if (this.effect) this.effect.destroy()
    }

    render() {   

        var allProps = this.state.search_results.map(
            (currentResult, index) =>  <TrendingSearches results = {currentResult} index = {index} />);
        
        return (
            <React.Fragment>
            {/* <div ref={this.myRef}> */}
                <div class = "all_results_top_searches">
                    {allProps}
                </div>
            {/* </div> */}
            </React.Fragment>
                        
        );
            
        }


    }
