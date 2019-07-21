const mongoose = require('mongoose');

const Schema = mongoose.Schema;
 
const cryptoSchema = new Schema({
   id_number : Number,
   coinName : String,
   coinSName : String,
   coinPrice : String,
   coinTotal : String,
   coin24 : String

},
{ collection: 'crypto_data_prices'}
);

const Crypto = mongoose.model('Crypto', cryptoSchema);

module.exports = Crypto;