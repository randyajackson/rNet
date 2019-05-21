import React, { Component } from 'react';
//import axios from "axios";

//const mongoose = require('../node_modules/mongoose');
//mongoose.Promise = global.Promise;
//mongoose.Connect("mongodb://localhost:5000/crypto");

class App extends Component 
{

  constructor(props) {
    super(props);

    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    fetch('http://localhost:5000/crypto')
      .then(response => response.json())
      .then(data => this.setState({ data }));
  }

  render()
  {
    const { items } = this.state;

      return(
      <div> 
        {items}
      </div>
      );
  }
}




export default App;