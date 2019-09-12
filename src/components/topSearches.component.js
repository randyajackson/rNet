import React, { Component } from 'react';

import '../css/Top_Searches_Component.css';
import './../css/progress_bar.css';

import { RadialProgress } from 'react-radial-progress-indicator';

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

function changePage() {
    setTimeout( () => {
        document.location.href = "http://localhost:3000/new_sneakers";
    }, 60*1000*3)     
 };

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
        changePage();

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

                <div style = {{ position: 'absolute', top: 540, right: 80, zIndex: '999', opacity: .6 }}>
                    <RadialProgress
                                ringBgColour= "#ffffff00"
                                ringFgColour="#8fbdff"
                                ringIntermediateColour="#8fbdff"
                                backgroundTransparent
                                duration={ 60*1000*3 }
                                ringThickness={1}
                                segmented={false}
                                showIntermediateProgress
                                startStep={0}
                                step={20}
                                steps={20}
                                width={150}
                                height={150}
                                text={function text(steps,percentage){return('')}}
                                />
                    </div>

                    <div className= "upcoming_list">
                        <div className= "list_entry one">Upcoming Shoes</div>
                        <div className= "list_entry two">Cryptocurrency</div>
                        <div className= "list_entry three">Upcoming Movies</div>
                        <div className= "list_entry four">Bandcamp Trends</div>
                    </div>
            {/* </div> */}
            </React.Fragment>
                        
        );
            
        }


    }
