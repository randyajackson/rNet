require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const client = require('twilio')(
  process.env.TWILIO_ACCOUT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post('/api/text', (req, res) => {
    res.header('Content-Type', 'application/json');
    
    client.messages
    .create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.P_PHONE_NUMBER,
      body: req.body.body
    })
    .then( (message) => { console.log(message.sid)});
    
});

