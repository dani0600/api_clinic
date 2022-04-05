const express = require("express");
const livingPlacesModel = require('./../models/livingplace');

const router = express.Router();

router.get('/', async function(req, res, next) {
    try {
        const livingPlaces = await livingPlacesModel.getAll(req.query);
        res.status(200).send(livingPlaces);
    }
    catch(error){
        next(error);
    }
  })

  
module.exports = router;