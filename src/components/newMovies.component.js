import React, { Component } from 'react';
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


const Movies= props => (
    <tr>
        <td>{props.results.title}</td>
        <td>{props.results.releaseDate}</td>
        <td>{props.results.rating}</td>
        <td>{props.results.synopsis}</td>
        <td><img src= {props.results.poster}></img></td>
    </tr>    
)
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
                {outputData}
            </React.Fragment>
            
        );
    }


}