const express = require("express");
const surgeryModel = require('./../models/surgery');
const {endpointProtection} = require('../services/middlewares/endpoint.protection.middleware');

const router = express.Router()

router.get('/', endpointProtection, async function(req, res, next) {
    try {
        const surgeries = await surgeryModel.getAll(req.query);
        res.status(200).send(surgeries);
    }
    catch(error){
        next(error);
    }
  })

  
module.exports = router;