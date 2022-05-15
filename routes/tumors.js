const express = require("express");
const tumorModel = require('./../models/tumor');
const {endpointProtection} = require('../services/middlewares/endpoint.protection.middleware');

const router = express.Router()

router.get('/', endpointProtection, async function(req, res, next) {
  try {
      const tumors = await tumorModel.getAll(req.query);
      res.status(200).send(tumors);
  }
  catch(error){
      next(error);
  }
})

router.get('/mutationTypes', endpointProtection, async function(req, res, next) {
  try {
      const mutations = await tumorModel.getMutationTypes();
      res.status(200).send(mutations);
  }
  catch(error){
      next(error);
  }
})



module.exports = router;