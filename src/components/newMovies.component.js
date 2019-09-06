import React, { Component } from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import '../css/Movie_Component.css';
import background from '../videos/test.mp4';

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
        <div class="movie_date">Releases: {props.results.releaseDate}</div>
        <div class="movie_rating">Rating: {props.results.rating}</div>
    </div>
        
)

function truncate(input) {
    if (input.length > 25)
       return input.substring(0,20) + '...';
    else
       return input;
 };
export default class newMovieList extends Component {

    constructor(props)
    {
        super(props);

        this.state = { 
                        movies: []  
                     };
    }    

    componentDidMount()
    {
        setInterval( () => {
            requester.request('http://localhost:8000/graphql', new_moviesQuery)
            .then(response => {
                
                for(i = 0; i < response.new_movie.length; i++)
                {
                    response.new_movie[i].title = truncate(response.new_movie[i].title);
                }

                this.setState({
                    movies: response.new_movie
                })
            })
            .catch((error) => {
                console.log(error);
            })
        }, 3000)
        
    }

    render() {

        var allProps = [];

        var numberOfSlides;
        

        allProps = this.state.movies.map(
            (currentMovies, index) =>  <Movies results = {currentMovies} />);
        
        if(allProps.length % 14 !== 0)
            numberOfSlides = parseInt( (allProps.length / 14) + 1);
        else
            numberOfSlides = parseInt( (allProps.length / 14) );
        
        var outputProps = [numberOfSlides];
        
        var x,y,z;
        for(x = 0, y = 0, z = 14; x < numberOfSlides; x++, y+=14, z+=14)
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

                {/* <video muted loop autoPlay id="bgVideo">
                    <source src= {background} type="video/mp4" />
                </video> */}

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
            </React.Fragment>
            
        );
    }


}