const express = require("express");
const surgeryModel = require('./../models/surgery');

const router = express.Router()

router.get('/', async function(req, res, next) {
    try {
        const surgeries = await surgeryModel.getAll(req.query);
        res.status(200).send(surgeries);
    }
    catch(error){
        next(error);
    }
  })

  
module.exports = router;