import React, { Component } from 'react';

import * as THREE from 'three';
import FOG from 'vanta/dist/vanta.fog.min';

import '../css/Movie_Component.css';
import './../css/progress_bar.css';

import { CarouselProvider, Slider, Slide} from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

import { RadialProgress } from 'react-radial-progress-indicator';


export default class plain extends Component {

    constructor(props)
    {
        super(props);

        this.myRef = React.createRef();
        
    }    

    componentDidMount()
    {

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
        
    }

    render() {
        return (
            <React.Fragment>
                <div ref={this.myRef} style={{width: '1920px', height: '1080px'}}></div>
            </React.Fragment>
            
        );
    }


}