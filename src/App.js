import React from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";
import '../src/css/Crypto_Component.css';
import PricesList from "./components/crypto.component";
import newMovieList from "./components/newMovies.component";
import BandcampResults from "./components/bandcamp.component";
import SneakerResults from "./components/sneakers.component";
import TopSearchesResults from "./components/topSearches.component";
import DebugDashboard from "./components/dashboard.component";

function App() {
  return (
    <Router>
        <Route path="/crypto" component={PricesList} />
        <Route path="/new_movies" component={newMovieList} />
        <Route path="/bc" component={BandcampResults} />
        <Route path="/new_sneakers" component={SneakerResults} />
        <Route path="/top_searches" component={TopSearchesResults} />
        <Route path="/dashboard" component={DebugDashboard} />
    </Router>
  );
}

export default App;
