import React, { Component } from 'react';

import * as THREE from 'three';
import FOG from 'vanta/dist/vanta.fog.min';

import '../css/Sneakers_Component.css';
import './../css/progress_bar.css';

import { CarouselProvider, Slider, Slide } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

import { RadialProgress } from 'react-radial-progress-indicator';

import logo from '../img/logo.png';



const requester = require('graphql-request');

const sneakerQuery = 
"{" +
    "upcoming_sneakers" +
    "{" +
      "title," +
      "style," +
      "thumbnail," +
      "day," +
      "month" +
    "}" +
"}";

const SneakerResultsProp = props => 
(
    <div className = "single_result_sneakers">

        <div className = "thumbnail">
            <img src = {props.results.thumbnail} alt = {props.results.thumbnail}></img>
        </div>

        <div className = "date"><span id="Month">  {props.results.month} </span> {props.results.day}  </div>
        <div className = "title">{props.results.title}</div>


    </div>
);

function truncate(input) {
    if (input.length > 45)
       return input.substring(0,40) + '...';
    else
       return input;
 };

 function changePage() {
    setTimeout( () => {
        document.location.href = "http://" + process.env.REACT_APP_LOCAL_HOST + ":3000/crypto";
    }, 60*1000*3)
    return false;     
 };

export default class SneakerResults extends Component {

    constructor(props){
        super(props);
        
        this.myRef = React.createRef();

        this.state = { 
                        sneaker_results: []
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
            requester.request("http://" + process.env.REACT_APP_LOCAL_HOST + ':8000/graphql', sneakerQuery)
            .then(response => {

                for(var i = 0; i < response.upcoming_sneakers.length; i++)
                {
                    response.upcoming_sneakers[i].title = truncate(response.upcoming_sneakers[i].title);
                }

                componentDidMountThis.setState({
                    sneaker_results: response.upcoming_sneakers
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

        }, 5000)
        
    }

    render() {   
 
            var allProps = [];

            var numberOfSlides;
            
            allProps = this.state.sneaker_results.map(
                (currentResult, index) =>  <SneakerResultsProp results = {currentResult} index = {index} />);
            
            if(allProps.length % 12 !== 0)
                numberOfSlides = parseInt( (allProps.length / 12) + 1);
            else
                numberOfSlides = parseInt( (allProps.length / 12) );
            
            var outputProps = [numberOfSlides];
            
            var x,y,z;
            for(x = 0, y = 0, z = 12; x < numberOfSlides; x++, y+=12, z+=12)
            {
                if (x !== numberOfSlides - 1)
                {
                    outputProps[x] = allProps.slice(y,z);
                }
                else
                {
                    outputProps[x] = allProps.slice(y);    
                }
            }
    
            var output = [];
            var i;
            for(i = 0; i < numberOfSlides; i++)
            {
                output.push(
                <Slide index={i}>
                    <div className = "all_results_sneakers">
                            {outputProps[i].slice(0)}                 
                        </div>
                </Slide>)    
            }

        return (
            <React.Fragment>
                <div ref={this.myRef} style={{width: '1920px', height: '1080px'}}>

                <div className = "headline">
                        upcoming<span class="bigger"> footwear</span>
                </div>

                <div className = "logo">
                    <img src = {logo} alt = {logo}></img>
                </div>

                    <div style = {{ position: 'absolute', top: 890, right: 400, zIndex: '999', opacity: .6}}>
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
                        <div className= "list_entry one">crypto<span class="bigger_next">currency</span></div>
                        <div className= "list_entry two">upcoming <span class="bigger_next">movies</span></div>
                        <div className= "list_entry three">popular <span class="bigger_next">options</span></div>
                        <div className= "list_entry four">bandcamp <span class="bigger_next">trends</span></div>
                    </div>

                    <CarouselProvider
                    naturalSlideWidth={100}
                    naturalSlideHeight={125}
                    isPlaying = {true}
                    totalSlides={numberOfSlides}
                    interval={10000}
                    >
                        <Slider>
                            {output}
                        </Slider>
                    </CarouselProvider>
            
                    
                </div>
            </React.Fragment>
                        
        );
            
        }


    }
