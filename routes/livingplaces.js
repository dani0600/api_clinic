const express = require("express");
const livingPlacesModel = require('./../models/livingplace');
const {endpointProtection} = require('../services/middlewares/endpoint.protection.middleware');

const router = express.Router();

router.get('/', endpointProtection, async function(req, res, next) {
    
    // Access the count parameter
    let type = req.query.count;
    if(type){
        if(type === 'true'){
            try{
                const countCitizens = await livingPlacesModel.getNumberPeopleByCity();
                res.status(200).send(countCitizens);
            }
            catch(error){
                next(error);
            }
        }
        else return [];
    }
    else{
        try {
            const livingPlaces = await livingPlacesModel.getAll();
            res.status(200).send(livingPlaces);
        }
        catch(error){
            next(error);
        }
    }
})



  
module.exports = router;