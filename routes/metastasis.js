const express = require("express");
const metastasisModel = require('./../models/metastasis');
const {endpointProtection} = require('../services/middlewares/endpoint.protection.middleware');


const router = express.Router()

router.get('/', endpointProtection, async function(req, res, next) {
    try {
        const metastasis = await metastasisModel.getAll(req.query);
        res.status(200).send(metastasis);
    }
    catch(error){
        next(error);
    }
  })
  
module.exports = router;