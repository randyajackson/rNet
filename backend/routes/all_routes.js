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

//routing for crypto data
router.route('/crypto').get((req, res) => {
    Crypto.find() 
    .then(prices => res.json(prices)) 
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;