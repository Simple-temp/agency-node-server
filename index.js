const express = require('express')
const cors = require("cors")
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb');
const fileUpload = require("express-fileupload")
require("dotenv").config()

const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("photo"));
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }))


app.get('/', (req, res) => {
    res.send("Agency")
})

const port = 4000;

app.listen(process.env.PORT || port, console.log("successfully running port 4000"))