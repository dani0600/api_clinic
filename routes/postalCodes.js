const express = require("express");
const postalCodeModel = require('./../models/postalCode');

const router = express.Router()

router.get('/', async function(req, res, next) {
    try {
        const postalCodes = await postalCodeModel.getAll(req.query);
        res.status(200).send(postalCodes);
    }
    catch(error){
        next(error);
    }
  })


  module.exports = router;