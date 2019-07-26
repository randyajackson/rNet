import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';

const Price = props => (
    <tr>
        <td>{props.price.id_number}</td>
        <td>{props.price.coinName}</td>
        <td>{props.price.coinSName}</td>
        <td>{props.price.coinPrice}</td>
        <td>{props.price.coinTotal}</td>
        <td>{props.price.coin24}</td>
    </tr>
)

export default class PricesList extends Component {

    constructor(props){
        super(props);

        this.state = { prices: [] };
    }

    componentDidMount()
    {
        setInterval( () => {
            axios.get('http://localhost:5000/crypto')
            .then(response => {
                this.setState({ prices: response.data})
            })
            .catch((error) => {
                console.log(error);
            })
        }, 3000)
    }

    render() {
        var outputData = new Array(10);

        for(var i = 0; i < 10; i++)
        {
            outputData[i] = this.state.prices.slice(i * 10, i + 9).map(
                (currentprice) =>  <Price price = {currentprice} />)
        }

        for(var i = 0; i < 10; i++)
        {
            outputData[i] =  <div>
            <h3>Crypto Prices</h3>
            <table className = "table">
            <thead className = "thead-light">
            <tr>
                <th>ID Number</th>
                <th>Coin Name</th>
                <th>Coin Short Name</th>
                <th>Coin Price</th>
                <th>Coin Total</th>
                <th>Coin Price Last 24</th>
            </tr>
            </thead>    
            <tbody>
             {outputData[i]} 
             </tbody>
                    </table>
            </div>;
        }
                    
        return (
            
            <CarouselProvider
            naturalSlideWidth={100}
            naturalSlideHeight={125}
            totalSlides={10}
          >
                            <Slider>
                            <Slide index={0}><div className="my-slide primary">{outputData[0]}</div></Slide>
                            <Slide index={1}><div className="my-slide primary">{outputData[1]}</div></Slide>
                            <Slide index={2}><div className="my-slide primary">{outputData[2]}</div></Slide>
                            <Slide index={3}><div className="my-slide primary">{outputData[3]}</div></Slide>
                            <Slide index={4}><div className="my-slide primary">{outputData[4]}</div></Slide>
                            <Slide index={5}><div className="my-slide primary">{outputData[5]}</div></Slide>
                            <Slide index={6}><div className="my-slide primary">{outputData[6]}</div></Slide>
                            <Slide index={7}><div className="my-slide primary">{outputData[7]}</div></Slide>
                            <Slide index={8}><div className="my-slide primary">{outputData[8]}</div></Slide>
                            <Slide index={9}><div className="my-slide primary">{outputData[9]}</div></Slide>
                            </Slider>
            </CarouselProvider>
                        
        );
            
        }


    }
