import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route} from "react-router-dom";

import PricesList from "./components/crypto.component";

function App() {
  return (
    <Router>
      <div className="container">
        <Route path="/" exact component={PricesList} />
      </div>
    </Router>
  );
}

export default App;
