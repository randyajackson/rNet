import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/fader.css';

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
        axios.get('http://localhost:5000/crypto')
        .then(response => {
            this.setState({ prices: response.data})
        })
        .catch((error) => {
            console.log(error);
        })
    }

    pricesList() {
        return this.state.prices.map(currentprice => {
            return <Price price = {currentprice} />;
        })
    }

    render() {
        
        let items;

        while (true) {
            items = this.state.prices.slice(0, 9).map(
                (currentprice) => <Price price = {currentprice} />)
        
        let output = <table className = "table">
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
                        <tbody class="elementToFadeInAndOut">
                            { items }
                        </tbody>
                    </table>
                    
        return (
            <div>
                <h3>Crypto Prices</h3>
                {output}
            </div>
        );
        }
    }
}