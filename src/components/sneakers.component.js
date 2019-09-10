import React, { Component } from 'react';
import '../css/Sneakers_Component.css';
import background from '../videos/test.mp4';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

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
    <div class = "single_result_sneakers">

        <div class = "thumbnail">
            <img src = {props.results.thumbnail} alt = {props.results.thumbnail}></img>
        </div>

        <div class = "date">{props.results.month}{props.results.day}</div>
        <div class = "title">{props.results.title}</div>


    </div>
);

function truncate(input) {
    if (input.length > 45)
       return input.substring(0,40) + '...';
    else
       return input;
 };


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

                for(var i = 0; i < response.upcoming_sneakers.length; i++)
                {
                    response.upcoming_sneakers[i].title = truncate(response.upcoming_sneakers[i].title);
                }

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
 
            var allProps = [];

            var numberOfSlides;
            
            allProps = this.state.sneaker_results.map(
                (currentResult, index) =>  <Sneaker_Results results = {currentResult} index = {index} />);
            
            if(allProps.length % 16 !== 0)
                numberOfSlides = parseInt( (allProps.length / 16) + 1);
            else
                numberOfSlides = parseInt( (allProps.length / 16) );
            
            var outputProps = [numberOfSlides];
            
            var x,y,z;
            for(x = 0, y = 0, z = 16; x < numberOfSlides; x++, y+=16, z+=16)
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
