const express = require("express");
const pm10Model = require('./../../models/stations/pm10');

const router = express.Router();

router.get('/', async function(req, res, next) {
    try{
        let latitude = req.query.latitude;
        let longitude = req.query.longitude;
        const pm10Station = await pm10Model.get(latitude, longitude);
        res.status(200).send(pm10Station);
    }
    catch(error){
        next(error);
    }
})



  
module.exports = router;