import React, { Component } from 'react';

import * as THREE from 'three';
import FOG from 'vanta/dist/vanta.fog.min';

import '../css/Movie_Component.css';
import './../css/progress_bar.css';

import { CarouselProvider, Slider, Slide} from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

import { RadialProgress } from 'react-radial-progress-indicator';

import logo from '../img/logo.png';

require('dotenv').config();

const requester = require('graphql-request');

var i; //global counter used in componentDidMount and return

const new_moviesQuery = 
"{" +
    "new_movie" +
    "{" +
      "title," +
      "releaseDate," +
      "rating," +
      "synopsis," +
      "poster" +
    "}" +
"}";


const Movies = props => (
    <div class = "single_movie">
        <div class="movie_poster"><img src = {props.results.poster} alt = {props.results.title}></img></div>
        <div class="movie_title">{props.results.title}</div>
        <div class="movie_date">releases: {props.results.releaseDate}</div>
        <div class="movie_rating">rating: {props.results.rating}</div>
    </div>
        
)

function changePage() {
    setTimeout( () => {
        document.location.href = "http://" + process.env.REACT_APP_LOCAL_HOST + ":3000/popular_options";
    }, 60*1000*3);
    return false;   
 };

function truncate(input) {
    if (input.length > 15)
       return input.substring(0,20) + '...';
    else
       return input;
 };
export default class newMovieList extends Component {

    constructor(props)
    {
        super(props);

        this.myRef = React.createRef();

        this.state = { 
                        movies: []  
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

        
        let getPageData = function() {
            let componentDidMountThis = this;
            requester.request("http://" + process.env.REACT_APP_LOCAL_HOST + ":8000/graphql", new_moviesQuery)
            .then(response => {
                
                for(i = 0; i < response.new_movie.length; i++)
                {
                    response.new_movie[i].title = truncate(response.new_movie[i].title);
                }

                componentDidMountThis.setState({
                    movies: response.new_movie
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

        var allProps = [];

        var numberOfSlides;
        

        allProps = this.state.movies.map(
            (currentMovies, index) =>  <Movies results = {currentMovies} />);
        
        if(allProps.length % 8 !== 0)
            numberOfSlides = parseInt( (allProps.length / 8) + 1);
        else
            numberOfSlides = parseInt( (allProps.length / 8) );
        
        var outputProps = [numberOfSlides];
        
        var x,y,z;
        for(x = 0, y = 0, z = 8; x < numberOfSlides; x++, y+=8, z+=8)
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
        for(i = 0; i < numberOfSlides; i++)
        {
            output.push(
            <Slide index={i}>
                <div className = "slide">
                    <div class="all-movies">
                        {outputProps[i].slice(0)}                 
                    </div>
                </div>
            </Slide>)    
        }
            

        return (
            <React.Fragment>
                <div ref={this.myRef} style={{width: '1920px', height: '1080px'}}>
            
            <div className = "headline">
                        upcoming<span class="bigger"> movies</span>
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
                <div className= "list_entry one">popular <span class="bigger_next">options</span></div>
                <div className= "list_entry one">bandcamp <span class="bigger_next">trends</span></div>
                <div className= "list_entry two">search <span class="bigger_next">trends</span></div>
                <div className= "list_entry three">upcoming <span class="bigger_next">shoes</span></div>
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