import React from 'react';
import axios from "axios";

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:5000/crypto");

function getDataFromDb() 
{
  fetch("http://localhost:3001/api/getData")
    .then(data => data.json())
    .then(res => this.setState({ data: res.data }));
};


function App(){
  return(
    //test
    <div> 
      <h1>Hello React</h1>
    </div>
  );
}
export default App;