const express = require("express");
const relativeModel = require('./../models/relative');
const {endpointProtection} = require('../services/middlewares/endpoint.protection.middleware');

const router = express.Router()

router.get('/', endpointProtection, async function(req, res, next) {
  try {
      const relatives = await relativeModel.getAll(req.query);
      res.status(200).send(relatives);
  }
  catch(error){
      next(error);
  }
})

router.post('/', endpointProtection, async function(req, res, next) {
  try {
      const relatives = await relativeModel.add(req.body);
      res.status(200).send(relatives);
  }
  catch(error){
      next(error);
  }
})

module.exports = router;