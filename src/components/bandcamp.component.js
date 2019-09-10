import React, { Component } from 'react';
import '../css/Bandcamp_Component.css';


const requester = require('graphql-request');

const bandcampQuery = 
"{" +
    "bandcamp" +
    "{" +
      "url," +
      "art_url," +
      "album_title," +
      "artist_name," +
      "item_description," +
      "count" +
    "}" +
"}";

const BC_Results = props => (
        <div>

        {(() => {
            if(typeof props.prevResults !== "undefined" && typeof props.prevResults !== "undefined")
            {
                if(props.prevResults.url === props.results.url && props.prevResults.count === props.results.count)
                {    
                    return(
                    <div class = "single_result_bc">

                        <div class = "album_art">
                            <img src = {props.results.art_url} alt = {props.results.art_url}></img>
                        </div>

                        <div class = "artist_name">{props.results.artist_name}</div>
                        <div class = "album_title">{props.results.album_title}</div>
                        <div class = "item_description">{props.results.item_description}</div>
                        <div class = "url">http:{props.results.url}</div>
                        <div class = "count"><h1>{props.results.count} sold</h1></div>
                    </div>);
                }
                else if(props.prevResults.url === props.results.url && props.prevResults.count !== props.results.count)
                {
                    return(
                    <div class = "single_result_bc">

                        <div class = "album_art">
                            <img src = {props.results.art_url} alt = {props.results.art_url}></img>
                        </div>

                        <div class = "artist_name">{props.results.artist_name}</div>
                        <div class = "album_title">{props.results.album_title}</div>
                        <div class = "item_description">{props.results.item_description}</div>
                        <div class = "url">http:{props.results.url}</div>
                        <div class = "count" id="changeGreen" ><h1>{props.results.count} sold</h1></div>
                    </div>);    
                }
                else
                {
                    return(
                    <div class = "single_result_bc" id = "changeRank">

                        <div class = "album_art">
                            <img src = {props.results.art_url} alt = {props.results.art_url}></img>
                        </div>

                        <div class = "artist_name">{props.results.artist_name}</div>
                        <div class = "album_title">{props.results.album_title}</div>
                        <div class = "item_description">{props.results.item_description}</div>
                        <div class = "url">http:{props.results.url}</div>
                        <div class = "count"><h1>{props.results.count} sold</h1></div>
                    </div>);  
                }
            }
            
        })()}    

        </div>
   
    
    
)

export default class BandcampResults extends Component {

    constructor(props){
        super(props);

        this.myRef = React.createRef();

        this.state = { 
                        bandcamp_results: [],
                        previous_bandcamp_results: []
                     };
    }

    componentDidMount()
    {
        this.effect = window.VANTA.FOG({
            el: this.myRef.current,
            highlightColor: 0xfff3f3,
            midtoneColor: 0x8fbdff,
            lowlightColor: 0xc088bd,
            baseColor: 0xffffff,
            blurFactor: 0.47,
            speed: 0.10,
            zoom: 1.10
            });

        setInterval( () => {

            requester.request('http://localhost:8000/graphql', bandcampQuery)
            .then(response => {
                this.getPrevResult();
                this.setState({
                    bandcamp_results: response.bandcamp
                })
            })
            .catch((error) => {
                console.log(error);
            })
        }, 5000)
        
    }

    getPrevResult()
    {
        this.setState({
            previous_bandcamp_results : this.state.bandcamp_results.slice()
        });
    }

    render() {   
        const names = this.state.bandcamp_results.map( (currentResult, index) =>  currentResult.artist_name);
        const count = this.state.bandcamp_results.map( (currentResult, index) =>  currentResult.count);

        var allProps = this.state.bandcamp_results.map(
            (currentResult, index) =>  <BC_Results results = {currentResult} prevResults = {this.state.previous_bandcamp_results[index]} index = {index} />);
        
        return (
            <React.Fragment>
                <div ref={this.myRef}>
                    <div class = "all_results_bc">
                        {allProps}
                    </div>
                </div>
            </React.Fragment>
                        
        );
            
        }


    }
