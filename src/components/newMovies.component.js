import React, { Component } from 'react';
import axios from 'axios';

const Movies= props => (
    <tr>
        <td>{props.results.new_movie.title}</td>
        <td>{props.results.new_movie.releaseDate}</td>
        <td>{props.results.new_movie.rating}</td>
        <td>{props.results.new_movie.synopsis}</td>
        <td>{props.results.new_movie.poster}</td>
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
            axios.get('http://localhost:5000/new_movies')
            
            .then(response => {
                this.setState({
                    movies: response.data
                })
            })
            .catch((error) => {
                console.log(error);
            })
        }, 60000)
        
    }

    render() {
        var outputData = new Array(1);

        outputData[0] = this.state.movies.map(
            (currentMovies, index) =>  <Movies results = {currentMovies} />);

        return (
            <React.Fragment>
                {outputData[0]}
            </React.Fragment>
            
        );
    }


}