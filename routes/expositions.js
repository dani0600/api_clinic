const express = require("express");
const expositionModel = require('./../models/exposition');
const {endpointProtection} = require('../middlewares/endpoint.protection.middleware');

const router = express.Router()



router.get('/', endpointProtection, async function(req, res, next) {
  try {
      const expositions = await expositionModel.getAll(req.query);
      res.status(200).send(expositions);
  }
  catch(error){
      next(error);
  }
});

router.get('/classified', endpointProtection, async function(req, res, next) {
  
  try {
    console.log("HOLA")
      const expositions = await expositionModel.getClassifiedExpositions();
      res.status(200).send(expositions);
  }
  catch(error){
      next(error);
  }
});




module.exports = router;