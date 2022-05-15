const express = require("express");
const leadModel = require('./../../models/stations/lead');

const router = express.Router();

router.get('/', async function(req, res, next) {
    try{
        let latitude = req.query.latitude;
        let longitude = req.query.longitude;
        const leadStation = await leadModel.get(latitude, longitude);
        res.status(200).send(leadStation);
    }
    catch(error){
        next(error);
    }
})



  
module.exports = router;