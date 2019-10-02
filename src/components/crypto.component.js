/*WARNING: first react component that I have made */

import React, { Component } from 'react';

import '../css/Crypto_Component.css';
import './../css/progress_bar.css';

import { CarouselProvider, Slider, Slide} from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

import parseCurrency from 'parse-currency';
import { RadialProgress } from 'react-radial-progress-indicator';

import logo from '../img/logo.png';


const requester = require('graphql-request');

const cryptoQuery = 
"{" +
    "crypto" +
    "{" +
      "coinName," +
      "coinSName," +
      "coinPrice," +
      "coinTotal," +
      "coin24" +
    "}" +
"}";

const Price = props => (
    <tr>
        <td>{props.price.coinName}</td>
        <td>{props.price.coinSName}</td>
        
        {(() => {
            if(typeof props.prevPrice !== "undefined")
            {
                if (parseCurrency(props.price.coinPrice) > parseCurrency(props.prevPrice.coinPrice))
                    {return(<td className = "changeGreen" >{'⬆'}{props.price.coinPrice}</td>)}
                else if (parseCurrency(props.price.coinPrice) < parseCurrency(props.prevPrice.coinPrice))
                    {return(<td className = "changeRed" >{'⬇'}{props.price.coinPrice}</td>)}
                else
                    {return(<td>{props.price.coinPrice}</td>)}
            }
            else
                {return(<td>{props.price.coinPrice}</td>)}
        })()}

        <td>{props.price.coinTotal}</td>

        {(() => {
            if(typeof props.prevPrice !== "undefined")
            {
                if (parseCurrency(props.price.coin24) > parseCurrency(props.prevPrice.coin24))
                    {return(<td className = "changeGreen">{'⬆'}{props.price.coin24}</td>)}    
                else if (parseCurrency(props.price.coin24) < parseCurrency(props.prevPrice.coin24))
                    {return(<td className = "changeRed">{'⬇'}{props.price.coin24}</td>)}
                else
                    {return(<td>{props.price.coin24}</td>)}
            }
            else
            {return(<td>{props.price.coin24}</td>)}
        })()} 

    </tr>
)

function changePage() {
    setTimeout( () => {
        document.location.href = "http://localhost:3000/new_movies";
    }, 60*1000*3);
    return false;  
 };

export default class PricesList extends Component {

    constructor(props){
        super(props);

        this.myRef = React.createRef();

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
        changePage();

        this.effect = window.VANTA.FOG({
            el: this.myRef.current,
            highlightColor: 0xfff3f3,
            midtoneColor: 0x8fbdff,
            lowlightColor: 0xc088bd,
            baseColor: 0xffffff,
            blurFactor: 0.47,
            speed: 1.5,
            zoom: 3.5
            });

        //used to read before setInterval delay
        let getPageData = function() {
            let componentDidMountThis = this;
            requester.request('http://localhost:8000/graphql', cryptoQuery)
            .then(response => {
                componentDidMountThis.getPrevPrice();
                componentDidMountThis.setState({

                    prices: response.crypto,

                    prices1: response.crypto.slice(0,9),
                    prices2: response.crypto.slice(10,19),
                    prices3: response.crypto.slice(20,29),
                    prices4: response.crypto.slice(30,39),
                    prices5: response.crypto.slice(40,49),
                    prices6: response.crypto.slice(50,59),
                    prices7: response.crypto.slice(60,69),
                    prices8: response.crypto.slice(70,79),
                    prices9: response.crypto.slice(80,89),
                    prices10: response.crypto.slice(90,99)
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
            outputData[i] =  <div className = "slide">
            <table>
            <thead>
            <tr>
                <th>Coin Name</th>
                <th>Short Name</th>
                <th>Price</th>
                <th>Total</th>
                <th>Price Last 24 Hours</th>
            </tr>
            </thead>    
            <tbody>
             {outputData[i]} 
             </tbody>
                    </table>
            </div>;
        }
                    
        return (
            <React.Fragment>

            <div ref={this.myRef}>

            <div style = {{ position: 'absolute', top: 540, right: 80, zIndex: '999' ,opacity: .6 }}>
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

            <div className = "headline">
                        cryptocurrency<span class="bigger"> market</span>
            </div>

            <div className = "logo">
                <img src = {logo} alt = {logo}></img>
            </div>

            <div className= "upcoming_list">
                <div className= "list_entry one">upcoming <span class="bigger_next">movies</span></div>
                <div className= "list_entry two">bandcamp <span class="bigger_next">trends</span></div>
                <div className= "list_entry three">search <span class="bigger_next">trends</span></div>
                <div className= "list_entry four">upcoming <span class="bigger_next">shoes</span></div>
            </div>
            
                <CarouselProvider
                naturalSlideWidth={100}
                naturalSlideHeight={125}
                isPlaying = {true}
                totalSlides={10}
                interval={20000}
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
            </div>
            </React.Fragment>
                        
        );
            
        }


    }
