import React, { Component } from 'react';

import '../css/Bandcamp_Component.css';
import './../css/progress_bar.css';

import { RadialProgress } from 'react-radial-progress-indicator';

import logo from '../img/logo.png';

const requester = require('graphql-request');

const bandcampQuery = 
"{" +
    "bandcamp" +
    "{" +
      "url," +
      "art_url," +
      "album_title," +
      "artist_name," +
      "item_description," +
      "count" +
    "}" +
"}";

const BandcampResultsProp = props => (
        <div>

        {(() => {
            if(typeof props.prevResults !== "undefined")
            {
                
                if(props.prevResults.url === props.results.url && props.prevResults.count === props.results.count)
                {
                    //state is unchanged    
                    return(
                    <div class = "single_result_bc">

                        <div class = "album_art">
                            <img src = {props.results.art_url} alt = {props.results.art_url}></img>
                        </div>

                        <div class = "artist_name">{props.results.artist_name}</div>
                        <div class = "album_title">{props.results.album_title}</div>
                        <div class = "item_description">{props.results.item_description}</div>
                        <div class = "url">http:{props.results.url}</div>
                        <div class = "count"><h1>{props.results.count} sold</h1></div>
                    </div>);
                }
                
                else if(props.prevResults.url === props.results.url && props.prevResults.count !== props.results.count)
                {
                    //only count has changed
                    return(
                    <div class = "single_result_bc">

                        <div class = "album_art">
                            <img src = {props.results.art_url} alt = {props.results.art_url}></img>
                        </div>

                        <div class = "artist_name">{props.results.artist_name}</div>
                        <div class = "album_title">{props.results.album_title}</div>
                        <div class = "item_description">{props.results.item_description}</div>
                        <div class = "url">http:{props.results.url}</div>
                        <div class = "count" id="changeGreen" ><h1>{props.results.count} sold</h1></div>
                    </div>);    
                }
                else
                {
                    //rank has changed, count may have changed also
                    return(
                    <div class = "single_result_bc" id = "changeRank">

                        <div class = "album_art">
                            <img src = {props.results.art_url} alt = {props.results.art_url}></img>
                        </div>

                        <div class = "artist_name">{props.results.artist_name}</div>
                        <div class = "album_title">{props.results.album_title}</div>
                        <div class = "item_description">{props.results.item_description}</div>
                        <div class = "url">http:{props.results.url}</div>
                        <div class = "count"><h1>{props.results.count} sold</h1></div>
                    </div>);  
                }
            }
            else
            {
                return(
                    //state is unchanged 
                    <div class = "single_result_bc">

                        <div class = "album_art">
                            <img src = {props.results.art_url} alt = {props.results.art_url}></img>
                        </div>

                        <div class = "artist_name">{props.results.artist_name}</div>
                        <div class = "album_title">{props.results.album_title}</div>
                        <div class = "item_description">{props.results.item_description}</div>
                        <div class = "url">http:{props.results.url}</div>
                        <div class = "count"><h1>{props.results.count} sold</h1></div>
                    </div>);
            }
            
        })()}    

        </div>
    
)

function changePage() {
    setTimeout( () => {
        document.location.href = "http://localhost:3000/top_searches";
    }, 60*1000*3);
    return false;    
 };

export default class BandcampResults extends Component {

    constructor(props){
        super(props);

        this.myRef = React.createRef();

        this.state = { 
                        bandcamp_results: [],
                        previous_bandcamp_results: []
                     };
    }

    componentDidMount()
    {
        changePage();

        this.effect = window.VANTA.FOG({
            el: this.myRef.current,
            highlightColor: 0xfff3f3,
            midtoneColor: 0x8fbdff,
            lowlightColor: 0xc088bd,
            baseColor: 0xffffff,
            blurFactor: 0.47,
            speed: 1.5,
            zoom: 3.5
            });
        
        //used to read before setInterval delay
        let getPageData = function() {
            let componentDidMountThis = this;
            requester.request('http://localhost:8000/graphql', bandcampQuery)
            .then(response => {
                componentDidMountThis.getPrevResult();
                componentDidMountThis.setState({
                        bandcamp_results: response.bandcamp
                    })
                })
            .catch((error) => {
                    console.log(error);
                });
        };
        
        getPageData.call(this);

        setInterval( () => {

            getPageData.call(this);

        }, 5000)
        
    }

    getPrevResult()
    {
        this.setState({
            previous_bandcamp_results : this.state.bandcamp_results.slice()
        });
    }

    render() {   

        var allProps = this.state.bandcamp_results.map(
            (currentResult, index) =>  <BandcampResultsProp results = {currentResult} prevResults = {this.state.previous_bandcamp_results[index]} index = {index} />);
        
        return (
            <React.Fragment>
                    
                <div ref={this.myRef}>

                    <div className = "headline">
                        bandcamp<span class="bigger"> trends</span>
                    </div>

                    <div className = "logo">
                        <img src = {logo} alt = {logo}></img>
                    </div>

                    <div class = "all_results_bc">
                        {allProps}
                    </div>

                    <div style = {{ position: 'absolute', top: 700, right: 80, zIndex: '999', opacity: .6 }}>
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
                        <div className= "list_entry one">search <span class="bigger_next">trends</span></div>
                        <div className= "list_entry two">upcoming <span class="bigger_next">shoes</span></div>
                        <div className= "list_entry three">crypto<span class="bigger_next">currency</span></div>
                        <div className= "list_entry four">upcoming <span class="bigger_next">movies</span></div>
                    </div>

                </div>
            </React.Fragment>
                        
        );
            
        }


    }
