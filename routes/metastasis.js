const express = require("express");
const metastasisModel = require('./../models/metastasis');

const router = express.Router()

router.get('/', async function(req, res, next) {
    try {
        const metastasis = await metastasisModel.getAll(req.query);
        res.status(200).send(metastasis);
    }
    catch(error){
        next(error);
    }
  })
  
module.exports = router;