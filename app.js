var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override");
//mongoose = require("mongoose");
/* Intento connectar amb MongoDB Atlas
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require("mongoose");
const uri = "mongodb+srv://pae2022:PAE_2022@cluster0.izfjc.mongodb.net/api-clinic?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var router = express.Router();

router.get("/", function (req, res) {
  res.send("Hello World!");
});

app.use(router);
/* ATLAS https://www.mongodb.com/languages/express-mongodb-rest-api-tutorial
client.connect(err => {
    const collection = client.db("test").collection("devices");
    console.log(collection)
    app.listen(3000, function () {
        console.log("Node server running on http://localhost:3000");
      });
  });*/
  /* LOCAL
  mongoose.connect("mongodb://localhost/api-clinic", function (err, res) {
    if (err) {
      console.log("ERROR: connecting to Database. " + err);
    }
    app.listen(3000, function () {
      console.log("Node server running on http://localhost:3000");
    });
  });*/
  app.listen(3000, function () {
    console.log("Node server running on http://localhost:3000");
  });