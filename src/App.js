import React from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";

import PricesList from "./components/crypto.component";

function App() {
  return (
    <Router>
      <div>
        <Route path="/" exact component={PricesList} />
      </div>
    </Router>
  );
}

export default App;
