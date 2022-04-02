//File: controllers/person.js
var mongoose = require("mongoose");
//var Person = mongoose.model("Person");
const dbo = require('../db/conn');
const express = require('express');
var router = express.Router();

//GET - Return all persons in the DB
router.route('/persons').get(async function (_req, res) {
  const dbConnect = dbo.getDb();
  console.log(dbConnect)
  dbConnect
    .collection('persons')
    .find({})
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send('Error fetching listings!');
      } else {
        console.log(result)
        res.json(result);
      }
    });
});
