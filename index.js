const express = require('express')
const cors = require("cors")
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb');
const fileUpload = require("express-fileupload")
require("dotenv").config()

const uri = "mongodb+srv://agency:agencypassword@cluster0.ka9ky.mongodb.net/agency?retryWrites=true&w=majority";
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
        const all = { img: file.name, company, email, subject, des, price }
        console.log(all)
        file.mv(`${__dirname}/photo/${file.name}`, err => {
            if (err) {
                console.log(err)
                return res.status(500).send({ msg: "file not uploaded" })
            }
            userServicecollection.insertOne(all)
                .then(function (result) {
                    res.send(result.insertedCount > 0)
                })
            // return res.send({ img: file.name, path: `/${file.name}` })
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
        const review = { img: file.name, title, companyName, des }
        console.log(review)
        file.mv(`${__dirname}/reviewphoto/${file.name}`, err => {
            if (err) {
                console.log(err)
                return res.status(500).send({ msg: "file not uploaded" })
            }
            userReviewcollection.insertOne(review)
                .then(function (result) {
                    res.send(result.insertedCount > 0)
                })
            // return res.send({ img: file.name, path: `/${file.name}` })
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
        const addService = {icon:file.name,title,des}
        file.mv(`${__dirname}/servicesphoto/${file.name}`, err => {
            if (err) {
                console.log(err)
                return res.status(500).send({ msg: "file not uploaded" })
            }
            adminServicecollection.insertOne(addService)
                .then(function (result) {
                    res.send(result.insertedCount > 0)
                })
            // return res.send({ img: file.name, path: `/${file.name}` })
        })

    })

    app.get("/getnewservices",(req,res)=>{
        adminServicecollection.find({})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    })

    app.post("/makenewadmin",(req,res)=>{
        const admin = req.body.admin;
        console.log(admin)
        adminCollection.insertOne({admin})
        .then(function (result) {
            res.send(result.insertedCount > 0)
        })
    })

    app.post("/isAdmin",(req,res)=>{
        adminCollection.find({admin:req.body.email})
        .toArray((err, doctors) => {
            res.send(doctors.length>0)
        })
    })

    console.log("db connected")

});


app.get('/', (req, res) => {
    res.send("Agency")
})

const port = 4000;

app.listen(process.env.PORT || port, console.log("successfully running port 4000"))