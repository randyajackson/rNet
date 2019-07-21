const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cryptoSchema = new Schema({
   "id#" : Number,
   "coinName" : String,
   "coinSName" : String,
   "coinPrice" : Number,
   "coinTotal" : String,
   "coin24" : Number

});

const Crypto = mongoose.model('Crypto', cryptoSchema);

module.exports = Crypto;