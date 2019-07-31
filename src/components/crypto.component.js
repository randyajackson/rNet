import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import parseCurrency from 'parse-currency';

const Price = props => (
    <tr>
        <td>{props.price.id_number}</td>
        <td>{props.price.coinName}</td>
        <td>{props.price.coinSName}</td>
        
        {(() => {
            if(typeof props.prevPrice !== "undefined")
            {
                if (parseCurrency(props.price.coinPrice) > parseCurrency(props.prevPrice.coinPrice))
                    {return(<td style = {{color: 'green'}}>{parseCurrency(props.price.coinPrice)} {parseCurrency(props.prevPrice.coinPrice)} {props.price.coinPrice}</td>)}
                else if (parseCurrency(props.price.coinPrice) < parseCurrency(props.prevPrice.coinPrice))
                    {return(<td style = {{color: 'red'}}>{parseCurrency(props.price.coinPrice)} {parseCurrency(props.prevPrice.coinPrice)} {props.price.coinPrice}</td>)}
                else
                    {return(<td style = {{color: 'black'}}>{parseCurrency(props.price.coinPrice)} {parseCurrency(props.prevPrice.coinPrice)} {props.price.coinPrice} </td>)}
            }
        })()}

        <td>{props.price.coinTotal}</td>

        {(() => {
            if(typeof props.prevPrice !== "undefined")
            {
                if (parseCurrency(props.price.coin24) > parseCurrency(props.price.coin24))
                    {return(<td style = {{color: 'green'}}>{parseCurrency(props.price.coin24)} {parseCurrency(props.prevPrice.coin24)} {props.price.coin24} </td>)}    
                else if (parseCurrency(props.price.coin24) < parseCurrency(props.prevPrice.coin24))
                    {return(<td style = {{color: 'red'}}>{parseCurrency(props.price.coin24)} {parseCurrency(props.prevPrice.coin24)} {props.price.coin24} </td>)}
                else
                    {return(<td style = {{color: 'black'}}>{parseCurrency(props.price.coin24)} {parseCurrency(props.prevPrice.coin24)} {props.price.coin24} </td>)}
            }
        })()} 

    </tr>
)

export default class PricesList extends Component {

    constructor(props){
        super(props);

        this.state = { 
                        prices: [],
                        prices1: [],
                        prices2: [],
                        prices3: [],
                        prices4: [],
                        prices5: [],
                        prices6: [],
                        prices7: [],
                        prices8: [],
                        prices9: [],
                        prices10: [],

                        prevPrices1: [],
                        prevPrices2: [],
                        prevPrices3: [],
                        prevPrices4: [],
                        prevPrices5: [],
                        prevPrices6: [],
                        prevPrices7: [],
                        prevPrices8: [],
                        prevPrices9: [],
                        prevPrices10: [],
                     };
    }

    componentDidMount()
    {
        setInterval( () => {
            axios.get('http://localhost:5000/crypto')
            
            .then(response => {
                this.getPrevPrice();
                this.setState({

                    prices: response.data,

                    prices1: response.data.slice(0,9),
                    prices2: response.data.slice(10,19),
                    prices3: response.data.slice(20,29),
                    prices4: response.data.slice(30,39),
                    prices5: response.data.slice(40,49),
                    prices6: response.data.slice(50,59),
                    prices7: response.data.slice(60,69),
                    prices8: response.data.slice(70,79),
                    prices9: response.data.slice(80,89),
                    prices10: response.data.slice(90,99)
                })
                
            })
            .catch((error) => {
                console.log(error);
            })
        }, 3000)
        
    }

    getPrevPrice()
    {
        this.setState({
            prevPrices1 : this.state.prices1.slice(),
            prevPrices2 : this.state.prices2.slice(),
            prevPrices3 : this.state.prices3.slice(),
            prevPrices4 : this.state.prices4.slice(),
            prevPrices5 : this.state.prices5.slice(),
            prevPrices6 : this.state.prices6.slice(),
            prevPrices7 : this.state.prices7.slice(),
            prevPrices8 : this.state.prices8.slice(),
            prevPrices9 : this.state.prices9.slice(),
            prevPrices10 : this.state.prices10.slice(),
        });
    }

    render() {
        var outputData = new Array(10);

        outputData[0] = this.state.prices1.map(
            (currentprice, index) =>  <Price price = {currentprice} prevPrice = {this.state.prevPrices1[index]} />)

        outputData[1] = this.state.prices2.map(
            (currentprice, index) =>  <Price price = {currentprice} prevPrice = {this.state.prevPrices2[index]}/>)

        outputData[2] = this.state.prices3.map(
            (currentprice, index) =>  <Price price = {currentprice} prevPrice = {this.state.prevPrices3[index]}/>)

        outputData[3] = this.state.prices4.map(
            (currentprice, index) =>  <Price price = {currentprice} prevPrice = {this.state.prevPrices4[index]}/>)
        
        outputData[4] = this.state.prices5.map(
            (currentprice, index) =>  <Price price = {currentprice} prevPrice = {this.state.prevPrices5[index]}/>)

        outputData[5] = this.state.prices6.map(
            (currentprice, index) =>  <Price price = {currentprice} prevPrice = {this.state.prevPrices6[index]}/>)

        outputData[6] = this.state.prices7.map(
            (currentprice, index) =>  <Price price = {currentprice} prevPrice = {this.state.prevPrices7[index]}/>)

        outputData[7] = this.state.prices8.map(
            (currentprice, index) =>  <Price price = {currentprice} prevPrice = {this.state.prevPrices8[index]}/>)

        outputData[8] = this.state.prices9.map(
            (currentprice, index) =>  <Price price = {currentprice} prevPrice = {this.state.prevPrices9[index]}/>)
        
        outputData[9] = this.state.prices10.map(
            (currentprice, index) =>  <Price price = {currentprice} prevPrice = {this.state.prevPrices10[index]}/>)
        

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
            isPlaying = {true}
            totalSlides={10}
          >
                            <Slider>
                            <Slide index={0}>{outputData[0]}</Slide>
                            <Slide index={1}>{outputData[1]}</Slide>
                            <Slide index={2}>{outputData[2]}</Slide>
                            <Slide index={3}>{outputData[3]}</Slide>
                            <Slide index={4}>{outputData[4]}</Slide>
                            <Slide index={5}>{outputData[5]}</Slide>
                            <Slide index={6}>{outputData[6]}</Slide>
                            <Slide index={7}>{outputData[7]}</Slide>
                            <Slide index={8}>{outputData[8]}</Slide>
                            <Slide index={9}>{outputData[9]}</Slide>
                            </Slider>
            </CarouselProvider>
                        
        );
            
        }


    }
