const express = require('express')
const cors = require("cors")
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb');
const fileUpload = require("express-fileupload")
const fs = require("fs-extra")
require("dotenv").config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ka9ky.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("photo"));
app.use(express.static("reviewphoto"));
app.use(express.static("servicesphoto"));
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }))


client.connect(err => {

    const userServicecollection = client.db("agency").collection("userservices");
    const userReviewcollection = client.db("agency").collection("userreview");
    const adminServicecollection = client.db("agency").collection("adminservice");
    const adminCollection = client.db("agency").collection("admin");

    app.post("/postuserorder", (req, res) => {
        const file = req.files.file;
        const company = req.body.company;
        const email = req.body.email;
        const subject = req.body.subject;
        const des = req.body.des;
        const price = req.body.price;
        const newImg = file.data
        const encImg = newImg.toString("base64")

            var image = {
                contentType : file.mimetype,
                size : file.size,
                img : Buffer.from(encImg,"base64")
            }

            userServicecollection.insertOne({ image, company, email, subject, des, price })
                .then(function (result) {
                    res.send(result.insertedCount > 0)
            })
    })

    app.get("/getorderedservices", (req, res) => {
        userServicecollection.find({email:req.query.email})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.post("/userreview", (req, res) => {

        const file = req.files.file;
        const title = req.body.title;
        const companyName = req.body.companyName;
        const des = req.body.des;
        const newImg = file.data
        const encImg = newImg.toString("base64")

            var image = {
                contentType : file.mimetype,
                size : file.size,
                img : Buffer (encImg,"base64")
            }
            userReviewcollection.insertOne({ image, title, companyName, des })
                .then(function (result) {
                    res.send(result.insertedCount > 0)
                })
    })

    app.get("/getfeedback",(req,res)=>{
        userReviewcollection.find({})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    })

    app.get("/getalldata",(req,res)=>{
        userServicecollection.find({})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    })

    app.post("/addnewservices",(req,res)=>{
        const file = req.files.file;
        const title = req.body.title;
        const des = req.body.des;
        const newImg = file.data
        const encImg = newImg.toString("base64")

            var image = {
                contentType : file.mimetype,
                size : file.size,
                img : Buffer (encImg,"base64")
            }
            adminServicecollection.insertOne({image,title,des})
                .then(function (result) {
                    res.send(result.insertedCount > 0)
                })
    })

    app.get("/getnewservices",(req,res)=>{
        adminServicecollection.find({})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    })

    app.post("/makenewadmin",(req,res)=>{
        const email = req.body.email;
        adminCollection.insertOne({email})
        .then(function (result) {
            res.send(result.insertedCount > 0)
        })
    })

    app.post("/isAdmin",(req,res)=>{
        const email = req.body.email
        console.log(email);
        adminCollection.find({email:email})
        .toArray((err, admin) => {
            res.send(admin.length > 0)
        })
    })

    console.log("db connected")

});


app.get('/', (req, res) => {
    res.send("Agency")
})

const port = 4000;

app.listen(process.env.PORT || port, console.log("successfully running port 4000"))