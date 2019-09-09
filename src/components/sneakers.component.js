import React, { Component } from 'react';
import '../css/Sneakers_Component.css';
import background from '../videos/test.mp4';

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

const Sneaker_Results = props => 
(
    <div class = "single_result">

        <div class = "thumbnail">
            <img src = {props.results.thumbnail} alt = {props.results.thumbnail}></img>
        </div>

        <div class = "date">{props.results.month}{props.results.day}</div>
        <div class = "title">{props.results.title}</div>


    </div>
);


export default class SneakerResults extends Component {

    constructor(props){
        super(props);

        this.state = { 
                        sneaker_results: []
                     };
    }

    componentDidMount()
    {
        setInterval( () => {

            requester.request('http://localhost:8000/graphql', sneakerQuery)
            .then(response => {
                this.setState({
                    sneaker_results: response.upcoming_sneakers
                })
            })
            .catch((error) => {
                console.log(error);
            })
        }, 5000)
        
    }

    render() {   

        var allProps = this.state.sneaker_results.map(
            (currentResult, index) =>  <Sneaker_Results results = {currentResult} index = {index} />);
        
        return (
            <React.Fragment>
                {/* <video muted loop autoPlay id="bgVideo">
                    <source src= {background} type="video/mp4" />
                </video> */}
                <div class = "all_results">
                    {allProps}
                </div>
            </React.Fragment>
                        
        );
            
        }


    }
