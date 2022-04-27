const express = require("express");
const postalCodeModel = require('./../models/postalCode');

const router = express.Router()

router.get('/', async function(req, res, next) {
    try {
        const postalCodes = await postalCodeModel.getAll();
        res.status(200).send(postalCodes);
    }
    catch(error){
        next(error);
    }
  })

  router.get('/provinces', async function(req, res, next) {
    try {
        const provinces = await postalCodeModel.getProvinces();
        res.status(200).send(provinces);
    }
    catch(error){
        next(error);
    }
  })

  router.get('/idPostalCode', async function(req, res, next) {
    try {
        const id = await postalCodeModel.getIdByPostalCode(req.query.postalCode)
        res.status(200).send(id);
    }
    catch(error){
        next(error);
    }
  })

  router.get('/cities', async function(req, res, next) {
    try {
        const provinces = await postalCodeModel.getCitiesByProvince(req.query.provincia);
        res.status(200).send(provinces);
    }
    catch(error){
        next(error);
    }
  })


  module.exports = router;