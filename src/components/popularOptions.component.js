import React, { Component } from 'react';

import * as THREE from 'three';
import FOG from 'vanta/dist/vanta.fog.min';

import '../css/Options_Component.css';
import './../css/progress_bar.css';

import { CarouselProvider, Slider, Slide} from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

import { RadialProgress } from 'react-radial-progress-indicator';

//import parseCurrency from 'parse-currency';

import logo from '../img/logo.png';

require('dotenv').config();

const requester = require('graphql-request');

const popular_options_query = 
"{" +
    "popular_options" +
    "{" +
        "symbol," +
        "name," +
        "price," +
        "iv_rank," +
        "total_volume," +
        "put_volume_pct," +
        "call_volume_pct," +
        "put_call_ratio," +
        "time" +
    "}" +
"}";

const OptionsRow = props => (
    <tr>
        <td>{props.current.symbol}</td>
        <td>{props.current.name}</td>
        <td>{props.current.price}</td>
        <td>{props.current.iv_rank}</td>
        <td>{props.current.total_volume}</td>
        <td>{props.current.put_volume_pct}</td>
        <td>{props.current.call_volume_pct}</td>
        <td>{props.current.time}</td>
    </tr>
)

function changePage() {
    setTimeout( () => {
        document.location.href = "http://" + process.env.REACT_APP_LOCAL_HOST + ":3000/bc";
    }, 60*1000*3);
    return false;   
 };

export default class Options extends Component {

    constructor(props)
    {
        super(props);

        this.myRef = React.createRef();

        this.state = { 
                        optionsCall: [],
                        optionsPut: []  
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

         //used to read before setInterval delay
         let getPageData = function() {
            let componentDidMountThis = this;
            requester.request("http://" + process.env.REACT_APP_LOCAL_HOST + ':8000/graphql', popular_options_query)
            .then(response => {

                componentDidMountThis.setState({
                    optionsCall: response.popular_options.slice(0,9),
                    optionsPut: response.popular_options.slice(10,19)
                })
                
            })
            .catch((error) => {
                console.log(error);
            });
        };

        //used to read before setInterval delay
        getPageData.call(this);

        setInterval( () => {
            getPageData.call(this);
        }, 3000);

    }

    render() {

        var outputData = new Array(2);

        outputData[0] = this.state.optionsCall.map(
            (callOptions, index) =>  <OptionsRow current = {callOptions} />);

        outputData[1] = this.state.optionsPut.map(
            (putOptions, index) =>  <OptionsRow current = {putOptions} />);
        
        let slideType;
        for(var i = 0; i < 2; i++)
        {
            outputData[i] =  <div className = "slideCall">
            <table class="tableOptions">
            <thead>
            <tr> 
                <th>Symbol</th>
                <th>Name</th>
                <th>Price</th>
                <th>IV Rank</th>
                <th>Total Volume</th>
                <th>Put Volume Percent</th>
                <th>Call Volume Percent</th>
                <th>Date</th>
            </tr>
            </thead>    
            <tbody>
                {outputData[i]} 
             </tbody>
                    </table>
            </div>;
        }
            
        return (
            
            <React.Fragment>
             
             <div ref={this.myRef} style={{width: '1920px', height: '1080px'}}>
            
            <div style = {{ position: 'absolute', top: 890, right: 400, zIndex: '999' ,opacity: .6 }}>
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

            <div className = "headline">
                        popular<span class="bigger"> options</span>
            </div>

            <div className = "logo">
                <img src = {logo} alt = {logo}></img>
            </div>

            <div className= "upcoming_list">
                <div className= "list_entry one">bandcamp <span class="bigger_next">trends</span></div>
                <div className= "list_entry two">search <span class="bigger_next">trends</span></div>
                <div className= "list_entry three">upcoming <span class="bigger_next">shoes</span></div>
                <div className= "list_entry four">crypto <span class="bigger_next">currency</span></div>
            </div>
            
                <CarouselProvider
                naturalSlideWidth={100}
                naturalSlideHeight={125}
                isPlaying = {true}
                totalSlides={2}
                interval={20000}
            >
                                <Slider>
                                <Slide index={0}>{outputData[0]}</Slide>
                                <Slide index={1}>{outputData[1]}</Slide>
                                </Slider>
                </CarouselProvider>
            </div>
            </React.Fragment>
                        
        );
    }


}