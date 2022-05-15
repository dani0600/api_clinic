const express = require("express");
const nickelModel = require('./../../models/stations/nickel');
const {endpointProtection} = require('../../services/middlewares/endpoint.protection.middleware');

const router = express.Router();

router.get('/', async function(req, res, next) {
    try{
        let latitude = req.query.latitude;
        let longitude = req.query.longitude;
        const nickelStation = await nickelModel.get(latitude, longitude);
        res.status(200).send(nickelStation);
    }
    catch(error){
        next(error);
    }
})



  
module.exports = router;