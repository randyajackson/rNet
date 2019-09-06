import React, { Component } from 'react';
import '../css/Movie_Component.css';
import background from '../videos/test.mp4';

const requester = require('graphql-request');

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
                
                for(let i = 0; i < response.new_movie.length; i++)
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

        var outputData = [];

        outputData = this.state.movies.map(
            (currentMovies, index) =>  <Movies results = {currentMovies} />);

        return (
            <React.Fragment>

            {/* <video muted loop autoPlay id="bgVideo">
                <source src= {background} type="video/mp4" />
            </video> */}

            <div className = "slide">
                <div class="all-movies">
                    {outputData}
                </div>
            </div>
                
            </React.Fragment>
            
        );
    }


}