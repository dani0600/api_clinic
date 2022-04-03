const express = require("express");
const tumorModel = require('./../models/tumor');

const router = express.Router()

router.get('/', async function(req, res, next) {
  try {
      const tumors = await tumorModel.getAll(req.query);
      res.status(200).send(tumors);
  }
  catch(error){
      next(error);
  }
})

router.post('/', async function(req, res, next) {
  try {
      const tumor = await tumorModel.add(req.query);
      res.status(200).send(tumor);
  }
  catch(error){
      next(error);
  }
})

module.exports = router;