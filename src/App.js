import React from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";
import '../src/css/Crypto_Component.css';
import PricesList from "./components/crypto.component";

function App() {
  return (
    <Router>
        <Route path="/crypto" exact component={PricesList} />
    </Router>
  );
}

export default App;
