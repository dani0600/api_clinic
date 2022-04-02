const express = require("express");
const personModel = require('./../models/person');

const router = express.Router()


router.get('/', async function(req, res, next) {
  try {
      const persons = await personModel.getAll(req.query);
      res.status(200).send(persons);
  }
  catch(error){
      next(error);
  }
})

module.exports = router;