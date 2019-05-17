import React from 'react';
import axios from "axios";

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:5000/crypto");

function App(){

  return(
    <div> 
      <h1>Hello React</h1>
    </div>
  );
}
export default App;