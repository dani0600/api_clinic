const express = require("express");
const suggestionModel = require('./../models/suggestion');
const {endpointProtection} = require('../services/middlewares/endpoint.protection.middleware');
const { checkProperties } = require("../models/relative");

const router = express.Router()

router.get('/', endpointProtection, async function(req, res, next) {
    try {
        const suggestions = await suggestionModel.getAll(req.query);
        res.status(200).send(suggestions);
    }
    catch(error){
        next(error);
    }
})

router.get('/count', async function(req, res, next) {
    try{
        const sum = await suggestionModel.countTotalSuggestions();
        res.json(sum);
    }
    catch(error){
        next(error);
    }
})

router.get('/marks', async function(req, res, next) {
    try {
        const marks = await suggestionModel.getAvgMark();
        res.status(200).send(marks);
    }
    catch(error){
        next(error);
    }
})

router.post('/', async function(req, res, next) {
    try {
        const suggestions = await suggestionModel.add(req.body);
        res.status(200).send(suggestions);
    }
    catch(error){
        next(error);
    }
})

module.exports = router;