const express = require("express");
const personModel = require('./../models/person');
const {endpointProtection} = require('../middlewares/endpoint.protection.middleware');

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

router.get('/ageRanges', endpointProtection, async function(req, res, next) {
  try {
      const ranges = await personModel.getAgeRanges();
      res.status(200).send(ranges);
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