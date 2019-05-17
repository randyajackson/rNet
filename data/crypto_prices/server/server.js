const express = require("express")
const mongoose = require("mongoose")

const app = express()

app.use(express.json())


app.listen(5000, () => {
    console.log("server is running at port 5000")
});


