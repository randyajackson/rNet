const router = require('express').Router();
let Crypto = require('../models/crypto.model');

//handles incoming http get requests
router.route('/').get((req, res) => {
    Crypto.find() // gets list of all exercises
    .then(prices => res.json(prices)) // gets exercises and exercises users in json format
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;