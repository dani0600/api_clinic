const express = require("express");
const livingPlacesModel = require('./../models/livingplace');
const {endpointProtection} = require('../middlewares/endpoint.protection.middleware');

const router = express.Router();

router.get('/', endpointProtection, async function(req, res, next) {
    try {
        const livingPlaces = await livingPlacesModel.getAll(req.query);
        res.status(200).send(livingPlaces);
    }
    catch(error){
        next(error);
    }
  })

  
module.exports = router;