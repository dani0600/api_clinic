const express = require("express");
const contaminantsModel = require('./../models/contaminant');

const router = express.Router();

router.get('/', async function(req, res, next) {
    try{
        let latitude = req.query.latitude;
        let longitude = req.query.longitude;
        const contaminants = await contaminantsModel.getStations(latitude, longitude);
        res.status(200).send(contaminants);
    }
    catch(error){
        next(error);
    }
})

router.get('/allDataRadon',async function(req, res, next) {
    try{
        
        const radonStations = await contaminantsModel.getAllRadon();
        res.status(200).send(radonStations);
    }
    catch(error){
        next(error);
    }
})



  
module.exports = router;