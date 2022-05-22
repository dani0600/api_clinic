const express = require("express");
const arsenicModel = require('./../../models/stations/arsenic');
const {endpointProtection} = require('../../services/middlewares/endpoint.protection.middleware');

const router = express.Router();

router.get('/', async function(req, res, next) {
    try{
        let latitude = req.query.latitude;
        let longitude = req.query.longitude;
        const arsenicStation = await arsenicModel.get(latitude, longitude);
        res.status(200).send(arsenicStation);
    }
    catch(error){
        next(error);
    }
})



  
module.exports = router;