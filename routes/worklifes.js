const express = require("express");
const worklifeModel = require('./../models/worklife');
const {endpointProtection} = require('../middlewares/endpoint.protection.middleware');

const router = express.Router()

router.get('/', endpointProtection, async function(req, res, next) {
  try {
      const worklifes = await worklifeModel.getAll(req.query);
      res.status(200).send(worklifes);
  }
  catch(error){
      next(error);
  }
})



module.exports = router;