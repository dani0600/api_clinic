const express = require("express");
const formModel = require('./../models/form');
const {endpointProtection} = require('../middlewares/endpoint.protection.middleware');

const router = express.Router()

router.post('/', endpointProtection, async function(req, res, next) {
  try {
      formModel.checkProperties(req.body);
      const form = await formModel.add(req.body);
      res.status(200).send(form);
  }
  catch(error){
      next(error);
  }
})


module.exports = router;