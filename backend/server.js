const express = require ('express');
const cors = require('cors');
const mongoose = require('mongoose');


require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//connect creates a promise
mongoose.connect('mongodb://localhost/crypto', {useNewUrlParser: true, useCreateIndex: true}) 
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect', err));

const connection = mongoose.connection;

//once connection is open show log
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

const cryptoRouter = require('./routes/all_routes');


app.use('/crypto', cryptoRouter);


app.listen(port, () => {
    console.log('Server is running on port:', {port});
});