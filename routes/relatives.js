const express = require("express");
const relativeModel = require('./../models/relative');

const router = express.Router()

router.get('/', async function(req, res, next) {
  try {
      const relatives = await relativeModel.getAll(req.query);
      res.status(200).send(relatives);
  }
  catch(error){
      next(error);
  }
})

router.post('/', async function(req, res, next) {
  try {
      const relatives = await relativeModel.add(req.body);
      res.status(200).send(relatives);
  }
  catch(error){
      next(error);
  }
})

module.exports = router;