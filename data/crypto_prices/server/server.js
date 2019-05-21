const express = require("express")
const mongoose = require("mongoose")

const app = express()

app.use(express.json())
const db = "mongodb://localhost/crypto"

mongoose.connect(db, ({useNewUrlParser: true}))
.then(console.log("connected to mongoDB"))
.catch (err=>console.log(err));

const priceSchema = new mongoose.Schema({
    "id#" : String,
    coinName : String,
    coinSName : String,
    coinPrice : String,
    coinTotal : String,
    coin24 : String
 })

const cryptoPrices = mongoose.model('crypto_data_prices', priceSchema)

app.get("/crypto", (req, res) =>{
    cryptoPrices.find().then(prices => res.json(prices))
});


app.listen(5000, () => {
    console.log("server is running at port 5000")
});


