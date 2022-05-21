const express = require("express");
const personModel = require('./../models/person');
const expositionModel = require('./../models/exposition');
const {endpointProtection} = require('../services/middlewares/endpoint.protection.middleware');
var csv = require('csv-express');

const router = express.Router()

router.get('/', endpointProtection, async function(req, res, next) {
    try {
        const persons = await personModel.getAll(req.query);
        res.status(200).send(persons);
    }
    catch(error){
        next(error);
    } 
})

router.get('/count', async function(req, res, next) {
    try{
        const sum = await personModel.countTotalPersons();
        res.json(sum);
    }
    catch(error){
        next(error);
    }
})

router.get('/locations', endpointProtection, async function(req, res, next) {
    try {
        const persons = await personModel.getLocations(req.query);
        res.status(200).send(persons);
    }
    catch(error){
        next(error);
    } 
})


router.get('/ageRanges', endpointProtection, async function(req, res, next) {
  try {
      const ranges = await personModel.getAgeRanges();
      res.status(200).send(ranges);
  }
  catch(error){
      next(error);
  }
})



router.get('/exportToCSV', endpointProtection, async function(req, res, next) {
  try {
      var persons= await personModel.exportPersonsToExcel();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/json');
      res.setHeader("Content-Disposition", 'attachment; filename=data.json');
      res.send(persons);
  }
  catch(error){
      next(error);
  }
})


router.post('/', endpointProtection, async function(req, res, next) {
  try {
      const persons = await personModel.add(req.body);
      res.status(200).send(persons);
  }
  catch(error){
      next(error);
  }
})

router.post('/upload', endpointProtection, async function(req, res, next) {
  try {
      const persons = await personModel.addDocument(req.body);
      res.status(200).send(persons);
  }
  catch(error){
      next(error);
  }
})

module.exports = router;