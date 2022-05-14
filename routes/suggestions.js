const express = require("express");
const suggestionModel = require('./../models/suggestion');
const {endpointProtection} = require('../middlewares/endpoint.protection.middleware');
const { checkProperties } = require("../models/relative");

const router = express.Router()

router.get('/', endpointProtection, async function(req, res, next) {
    
    let option = req.query.option;
    if(option === 'count'){
        try{
            const sum = await suggestionModel.countTotalSuggestions();
            res.json(sum);
        }
        catch(error){
            next(error);
        }
    }
    else{
        try {
            const suggestions = await suggestionModel.getAll(req.query);
            res.status(200).send(suggestions);
        }
        catch(error){
            next(error);
        }
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

router.post('/', endpointProtection, async function(req, res, next) {
    try {
        const suggestions = await suggestionModel.add(req.body);
        res.status(200).send(suggestions);
    }
    catch(error){
        next(error);
    }
})

module.exports = router;