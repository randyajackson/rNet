import React, { Component } from 'react';

import * as THREE from 'three';
import FOG from 'vanta/dist/vanta.fog.min';

import '../css/Top_Searches_Component.css';
import './../css/progress_bar.css';

import { RadialProgress } from 'react-radial-progress-indicator';

import logo from '../img/logo.png';

require('dotenv').config();

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
        document.location.href = "http://" + process.env.REACT_APP_LOCAL_HOST + ":3000/new_sneakers";
    }, 60*1000*3);
    return false;     
 };

export default class TopSearchesResults extends Component {

    constructor(props){
        super(props);
        
        this.myRef = React.createRef();

        this.state = { 
                        search_results: []
                     };
    }

    componentDidMount()
    {   
        changePage();

        this.effect = FOG({
            el: this.myRef.current,
            highlightColor: 0xfff3f3,
            midtoneColor: 0x8fbdff,
            lowlightColor: 0xc088bd,
            baseColor: 0xffffff,
            blurFactor: 0.47,
            speed: 1.5,
            zoom: 3.5,
            THREE: THREE
            });

        let getPageData = function() { // arrow function preserves this from parent function
            let componentDidMountThis = this;
            requester.request("http://" + process.env.REACT_APP_LOCAL_HOST + ':8000/graphql', topSearchQuery)
            .then(response => {
                componentDidMountThis.setState({
                    search_results: response.top_searches
                }).bind(this)
            })
            .catch((error) => {
                console.log(error);
            })

        };
        
        //used to read before setInterval delay
        getPageData.call(this);
        
        setInterval( () => {

            getPageData.call(this);

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
            <div ref={this.myRef} style={{width: '1920px', height: '1080px'}}>
                <div class = "all_results_top_searches">
                    {allProps}
                </div>

                <div className = "headline">
                        search<span class="bigger"> trends</span>
                </div>

                <div className = "logo">
                    <img src = {logo} alt = {logo}></img>
                </div>

                <div style = {{ position: 'absolute', top: 890, right: 400, zIndex: '999', opacity: .6 }}>
                    <RadialProgress
                                ringBgColour= "#ffffff00"
                                ringFgColour= "#ffffff"
                                ringIntermediateColour= "#ffffff"
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
                        <div className= "list_entry one">upcoming <span class="bigger_next">shoes</span></div>
                        <div className= "list_entry two">crypto<span class="bigger_next">currency</span></div>
                        <div className= "list_entry three">upcoming <span class="bigger_next">movies</span></div>
                        <div className= "list_entry four">bandcamp <span class="bigger_next">trends</span></div>
                    </div>
            </div>
            </React.Fragment>
                        
        );
            
        }


    }
