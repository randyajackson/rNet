import { request } from "graphql-request";
const router = require('express').Router();

let Crypto = require('../models/crypto.model');

const graphql_url = "http://localhost:8000/graphql";

/**
 * {
  bandcamp
  {
	  url,
    art_url,
    album_title,
    artist_name,
    item_description,
    count
  }
}
 */

const new_moviesQuery = 
"query {" +
    "new_movie" +
    "{" +
      "title," +
      "releaseDate," +
      "rating," +
      "synopsis," +
      "poster" +
    "}" +
"}";

//routing for crypto data
router.route('/crypto').get((req, res) => {
    Crypto.find() 
    .then(prices => res.json(prices)) 
    .catch(err => res.status(400).json('Error: ' + err));
});

//routing for new_movies data
router.route('/new_movies').get((req, res) => {
    
    request(graphql_url, new_moviesQuery)
    .then(new_releases => res.json(new_releases)) 
    .catch(err => res.status(400).json('Error: ' + err));
});



module.exports = router;