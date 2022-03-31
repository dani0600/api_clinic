//File: controllers/tvshows.js
var mongoose = require("mongoose");
var Person = mongoose.model("Person");

//GET - Return all tvshows in the DB
exports.findAllPersons = function (req, res) {
    Person.find(function (err, persons) {
    if (err) res.send(500, err.message);

    console.log("GET /persons");
    res.status(200).jsonp(persons);
  });
};